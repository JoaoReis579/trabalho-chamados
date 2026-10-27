import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CriarTipoProblemaDto } from './dto/criar-tipo-problema.dto.js';
import { AtualizarTipoProblemaDto } from './dto/atualizar-tipo-problema.dto.js';
import { FiltroTipoProblemaDto } from './dto/filtro-tipo-problema.dto.js';
@Injectable()
export class TiposProblemaService {
  constructor(private readonly prisma: PrismaService) {}
  async criar(dto: CriarTipoProblemaDto) {
    if (dto.ativo !== undefined && typeof dto.ativo !== 'boolean') throw new BadRequestException('O campo ativo deve ser booleano.');
    if (await this.prisma.tipoProblema.findUnique({ where: { nome: dto.nome } })) throw new ConflictException('Já existe um tipo de problema com este nome.');
    try { return await this.prisma.tipoProblema.create({ data: dto }); }
    catch (e) { if (this.ehDuplicado(e)) throw new ConflictException('Já existe um tipo de problema com este nome.'); throw e; }
  }
  listar(filtros: FiltroTipoProblemaDto) { return this.prisma.tipoProblema.findMany({ where: { ativo: filtros.ativo }, orderBy: { id: 'asc' } }); }
  async buscar(id: number) { const tipo = await this.prisma.tipoProblema.findUnique({ where: { id } }); if (!tipo) throw new NotFoundException('Tipo de problema não encontrado.'); return tipo; }
  async atualizar(id: number, dto: AtualizarTipoProblemaDto) {
    await this.buscar(id);
    if (dto.ativo !== undefined && typeof dto.ativo !== 'boolean') throw new BadRequestException('O campo ativo deve ser booleano.');
    if (dto.nome && await this.prisma.tipoProblema.findFirst({ where: { nome: dto.nome, id: { not: id } } })) throw new ConflictException('Já existe um tipo de problema com este nome.');
    try { return await this.prisma.tipoProblema.update({ where: { id }, data: dto }); }
    catch (e) { if (this.ehDuplicado(e)) throw new ConflictException('Já existe um tipo de problema com este nome.'); throw e; }
  }
  async remover(id: number) {
    await this.buscar(id);
    if (await this.prisma.chamado.count({ where: { tipoProblemaId: id } })) throw new BadRequestException('Este tipo já foi usado em chamado. Para removê-lo, desative-o com PATCH /tipos-problema/:id e ativo=false.');
    await this.prisma.tipoProblema.delete({ where: { id } });
    return { mensagem: 'Tipo de problema removido com sucesso.' };
  }
  private ehDuplicado(erro: unknown): boolean { return typeof erro === 'object' && erro !== null && 'code' in erro && erro.code === 'P2002'; }
}
