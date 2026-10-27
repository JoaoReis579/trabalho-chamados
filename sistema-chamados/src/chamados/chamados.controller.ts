import { BadRequestException, Body, Controller, Get, Param, ParseEnumPipe, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ChamadosService } from './chamados.service.js';
import { AbrirChamadoDto } from './dto/abrir-chamado.dto.js';
import { FiltroChamadosDto } from './dto/filtro-chamados.dto.js';
import { DesignarTecnicoDto } from './dto/designar-tecnico.dto.js';
import { AlterarSituacaoDto } from './dto/alterar-situacao.dto.js';
import { CriarComentarioDto } from './dto/criar-comentario.dto.js';
import { Prioridade, SituacaoChamado } from '../generated/prisma/client.js';
@Controller('chamados')
export class ChamadosController {
  constructor(private readonly service: ChamadosService) {}
  @Post() abrir(@Body() dto: AbrirChamadoDto) { return this.service.abrir(dto); }
  @Get() listar(@Query('situacao', new ParseEnumPipe(SituacaoChamado, { optional: true, exceptionFactory: () => new BadRequestException('O filtro situacao é inválido.') })) situacao?: SituacaoChamado, @Query('prioridade', new ParseEnumPipe(Prioridade, { optional: true, exceptionFactory: () => new BadRequestException('O filtro prioridade deve ser BAIXA, MEDIA, ALTA ou CRITICA.') })) prioridade?: Prioridade, @Query('tipoProblemaId', new ParseIntPipe({ optional: true, exceptionFactory: () => new BadRequestException('O filtro tipoProblemaId deve ser um número inteiro.') })) tipoProblemaId?: number, @Query('tecnicoId', new ParseIntPipe({ optional: true, exceptionFactory: () => new BadRequestException('O filtro tecnicoId deve ser um número inteiro.') })) tecnicoId?: number) { return this.service.listar({ situacao, prioridade, tipoProblemaId, tecnicoId } as FiltroChamadosDto); }
  @Get(':id') buscar(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException('O ID do chamado deve ser um número inteiro.') })) id: number) { return this.service.buscar(id); }
  @Patch(':id/designar-tecnico') designar(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException('O ID do chamado deve ser um número inteiro.') })) id: number, @Body() dto: DesignarTecnicoDto) { return this.service.designarTecnico(id, dto); }
  @Patch(':id/situacao') alterarSituacao(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException('O ID do chamado deve ser um número inteiro.') })) id: number, @Body() dto: AlterarSituacaoDto) { return this.service.alterarSituacao(id, dto); }
  @Post(':id/comentarios') comentar(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException('O ID do chamado deve ser um número inteiro.') })) id: number, @Body() dto: CriarComentarioDto) { return this.service.criarComentario(id, dto); }
  @Get(':id/comentarios') listarComentarios(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException('O ID do chamado deve ser um número inteiro.') })) id: number) { return this.service.listarComentarios(id); }
}
