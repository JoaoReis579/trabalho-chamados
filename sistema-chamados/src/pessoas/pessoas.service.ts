import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CriarPessoaDto } from './dto/criar-pessoa.dto.js';
import { AtualizarPessoaDto } from './dto/atualizar-pessoa.dto.js';
import { FiltroPessoasDto } from './dto/filtro-pessoas.dto.js';

@Injectable()
export class PessoasService {
  constructor(private readonly prisma: PrismaService) {}
  async criar(dto: CriarPessoaDto) {
    if (dto.ativo !== undefined && typeof dto.ativo !== 'boolean') throw new BadRequestException('O campo ativo deve ser booleano.');
    if (await this.prisma.pessoa.findUnique({ where: { email: dto.email } })) throw new ConflictException('Já existe uma pessoa com este e-mail.');
    try { return await this.prisma.pessoa.create({ data: dto }); }
    catch (e) { if (this.ehDuplicado(e)) throw new ConflictException('Já existe uma pessoa com este e-mail.'); throw e; }
  }
  listar(filtros: FiltroPessoasDto) { return this.prisma.pessoa.findMany({ where: { tipo: filtros.tipo, ativo: filtros.ativo }, orderBy: { id: 'asc' } }); }
  async buscar(id: number) { const pessoa = await this.prisma.pessoa.findUnique({ where: { id } }); if (!pessoa) throw new NotFoundException('Pessoa não encontrada.'); return pessoa; }
  async atualizar(id: number, dto: AtualizarPessoaDto) {
    await this.buscar(id);
    if (dto.ativo !== undefined && typeof dto.ativo !== 'boolean') throw new BadRequestException('O campo ativo deve ser booleano.');
    if (dto.email && await this.prisma.pessoa.findFirst({ where: { email: dto.email, id: { not: id } } })) throw new ConflictException('Já existe uma pessoa com este e-mail.');
    try { return await this.prisma.pessoa.update({ where: { id }, data: dto }); }
    catch (e) { if (this.ehDuplicado(e)) throw new ConflictException('Já existe uma pessoa com este e-mail.'); throw e; }
  }
  async remover(id: number) {
    await this.buscar(id);
    const [solicitados, tecnicos, comentarios] = await Promise.all([
      this.prisma.chamado.count({ where: { solicitanteId: id } }),
      this.prisma.chamado.count({ where: { tecnicoId: id } }),
      this.prisma.comentario.count({ where: { autorId: id } }),
    ]);
    if (solicitados + tecnicos + comentarios > 0) throw new BadRequestException('Esta pessoa já tem envolvimento em chamado. Para removê-la, desative-a com PATCH /pessoas/:id e ativo=false.');
    await this.prisma.pessoa.delete({ where: { id } });
    return { mensagem: 'Pessoa removida com sucesso.' };
  }
  private ehDuplicado(erro: unknown): boolean { return typeof erro === 'object' && erro !== null && 'code' in erro && erro.code === 'P2002'; }
}
