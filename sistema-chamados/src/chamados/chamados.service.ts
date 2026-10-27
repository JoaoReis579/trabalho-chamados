import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AbrirChamadoDto } from './dto/abrir-chamado.dto.js';
import { FiltroChamadosDto } from './dto/filtro-chamados.dto.js';
import { DesignarTecnicoDto } from './dto/designar-tecnico.dto.js';
import { AlterarSituacaoDto } from './dto/alterar-situacao.dto.js';
import { CriarComentarioDto } from './dto/criar-comentario.dto.js';
import { Prioridade, SituacaoChamado, TipoPessoa } from '../generated/prisma/client.js';

const TRANSICOES: Record<SituacaoChamado, SituacaoChamado[]> = {
  [SituacaoChamado.ABERTO]: [SituacaoChamado.EM_ATENDIMENTO, SituacaoChamado.CANCELADO],
  [SituacaoChamado.EM_ATENDIMENTO]: [SituacaoChamado.RESOLVIDO, SituacaoChamado.CANCELADO],
  [SituacaoChamado.RESOLVIDO]: [SituacaoChamado.FECHADO, SituacaoChamado.EM_ATENDIMENTO],
  [SituacaoChamado.FECHADO]: [],
  [SituacaoChamado.CANCELADO]: [],
};

@Injectable()
export class ChamadosService {
  constructor(private readonly prisma: PrismaService) {}

  async abrir(dto: AbrirChamadoDto) {
    const solicitante = await this.prisma.pessoa.findUnique({ where: { id: dto.solicitanteId } });
    if (!solicitante) throw new NotFoundException('Pessoa solicitante não encontrada.');
    if (!solicitante.ativo) throw new BadRequestException('Pessoa inativa não pode abrir chamado.');
    if (solicitante.tipo !== TipoPessoa.SOLICITANTE) throw new BadRequestException('Somente uma pessoa do tipo SOLICITANTE pode abrir chamado.');
    const tipoProblema = await this.prisma.tipoProblema.findUnique({ where: { id: dto.tipoProblemaId } });
    if (!tipoProblema) throw new NotFoundException('Tipo de problema não encontrado.');
    if (!tipoProblema.ativo) throw new BadRequestException('Não é possível abrir chamado em um tipo de problema desativado.');
    return this.prisma.chamado.create({ data: { titulo: dto.titulo.trim(), descricao: dto.descricao.trim(), prioridade: dto.prioridade ?? Prioridade.MEDIA, solicitanteId: dto.solicitanteId, tipoProblemaId: dto.tipoProblemaId } });
  }

  listar(filtros: FiltroChamadosDto) {
    return this.prisma.chamado.findMany({ where: { situacao: filtros.situacao, prioridade: filtros.prioridade, tipoProblemaId: filtros.tipoProblemaId, tecnicoId: filtros.tecnicoId }, orderBy: { criadoEm: 'desc' } });
  }

  async buscar(id: number) {
    const chamado = await this.prisma.chamado.findUnique({ where: { id }, include: { solicitante: true, tecnico: true, tipoProblema: true, comentarios: { orderBy: [{ criadoEm: 'asc' }, { id: 'asc' }], include: { autor: true } } } });
    if (!chamado) throw new NotFoundException('Chamado não encontrado.');
    return chamado;
  }

  async designarTecnico(id: number, dto: DesignarTecnicoDto) {
    const chamado = await this.buscar(id);
    this.validarAberto(chamado.situacao);
    const tecnico = await this.prisma.pessoa.findUnique({ where: { id: dto.tecnicoId } });
    if (!tecnico) throw new NotFoundException('Técnico não encontrado.');
    if (!tecnico.ativo) throw new BadRequestException('Pessoa inativa não pode ser designada como técnico.');
    if (tecnico.tipo !== TipoPessoa.TECNICO) throw new BadRequestException('Somente uma pessoa do tipo TECNICO pode ser designada.');
    if (tecnico.id === chamado.solicitanteId) throw new BadRequestException('O técnico designado não pode ser o próprio solicitante.');
    const proximaSituacao = chamado.situacao === SituacaoChamado.ABERTO ? SituacaoChamado.EM_ATENDIMENTO : chamado.situacao;
    if (proximaSituacao === SituacaoChamado.EM_ATENDIMENTO && chamado.tecnicoId !== tecnico.id) {
      return this.prisma.$transaction(async (tx) => {
        const total = await tx.chamado.count({ where: { tecnicoId: tecnico.id, situacao: SituacaoChamado.EM_ATENDIMENTO } });
        if (total >= 5) throw new BadRequestException('O técnico já possui 5 chamados em atendimento e não pode receber outro.');
        return tx.chamado.update({ where: { id }, data: { tecnicoId: tecnico.id, situacao: proximaSituacao } });
      }, { isolationLevel: 'Serializable' });
    }
    return this.prisma.chamado.update({ where: { id }, data: { tecnicoId: tecnico.id, situacao: proximaSituacao } });
  }

  async alterarSituacao(id: number, dto: AlterarSituacaoDto) {
    const chamado = await this.buscar(id);
    this.validarAberto(chamado.situacao);
    if (!TRANSICOES[chamado.situacao].includes(dto.situacao)) throw new BadRequestException(`Transição de ${chamado.situacao} para ${dto.situacao} não é permitida.`);
    if (dto.situacao === SituacaoChamado.EM_ATENDIMENTO) {
      if (!chamado.tecnicoId) throw new BadRequestException('Não é possível iniciar o atendimento sem um técnico designado.');
      if (chamado.situacao === SituacaoChamado.RESOLVIDO) {
        return this.prisma.$transaction(async (tx) => {
          const total = await tx.chamado.count({ where: { tecnicoId: chamado.tecnicoId!, situacao: SituacaoChamado.EM_ATENDIMENTO } });
          if (total >= 5) throw new BadRequestException('O técnico já possui 5 chamados em atendimento e não pode receber outro.');
          return tx.chamado.update({ where: { id }, data: { situacao: SituacaoChamado.EM_ATENDIMENTO, resolvidoEm: null } });
        }, { isolationLevel: 'Serializable' });
      }
    }
    return this.prisma.chamado.update({ where: { id }, data: { situacao: dto.situacao, resolvidoEm: dto.situacao === SituacaoChamado.RESOLVIDO ? new Date() : dto.situacao === SituacaoChamado.EM_ATENDIMENTO ? null : undefined } });
  }

  async criarComentario(id: number, dto: CriarComentarioDto) {
    const chamado = await this.buscar(id);
    this.validarAberto(chamado.situacao);
    const autor = await this.prisma.pessoa.findUnique({ where: { id: dto.autorId } });
    if (!autor) throw new NotFoundException('Autor do comentário não encontrado.');
    if (!autor.ativo) throw new ForbiddenException('Pessoa inativa não pode comentar.');
    if (autor.id !== chamado.solicitanteId && autor.id !== chamado.tecnicoId) throw new ForbiddenException('Somente o solicitante ou o técnico responsável pode comentar neste chamado.');
    const texto = dto.texto.trim();
    if (!texto) throw new BadRequestException('O comentário não pode conter apenas espaços.');
    return this.prisma.comentario.create({ data: { chamadoId: id, autorId: autor.id, texto } });
  }

  async listarComentarios(id: number) {
    await this.buscar(id);
    return this.prisma.comentario.findMany({ where: { chamadoId: id }, include: { autor: true }, orderBy: [{ criadoEm: 'asc' }, { id: 'asc' }] });
  }

  private validarAberto(situacao: SituacaoChamado): void {
    if (situacao === SituacaoChamado.FECHADO || situacao === SituacaoChamado.CANCELADO) throw new BadRequestException('Chamado encerrado não pode ser alterado nem receber comentários.');
  }
}
