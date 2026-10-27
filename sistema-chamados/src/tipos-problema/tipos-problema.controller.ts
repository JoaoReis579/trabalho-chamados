import { BadRequestException, Body, Controller, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { TiposProblemaService } from './tipos-problema.service.js';
import { CriarTipoProblemaDto } from './dto/criar-tipo-problema.dto.js';
import { AtualizarTipoProblemaDto } from './dto/atualizar-tipo-problema.dto.js';
import { FiltroTipoProblemaDto } from './dto/filtro-tipo-problema.dto.js';
@Controller('tipos-problema')
export class TiposProblemaController {
  constructor(private readonly service: TiposProblemaService) {}
  @Post() criar(@Body() dto: CriarTipoProblemaDto) { return this.service.criar(dto); }
  @Get() listar(@Query('ativo', new ParseBoolPipe({ optional: true, exceptionFactory: () => new BadRequestException('O filtro ativo deve ser true ou false.') })) ativo?: unknown) { return this.service.listar({ ativo } as FiltroTipoProblemaDto); }
  @Get(':id') buscar(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException('O ID do tipo de problema deve ser um número inteiro.') })) id: number) { return this.service.buscar(id); }
  @Patch(':id') atualizar(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException('O ID do tipo de problema deve ser um número inteiro.') })) id: number, @Body() dto: AtualizarTipoProblemaDto) { return this.service.atualizar(id, dto); }
  @Delete(':id') remover(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException('O ID do tipo de problema deve ser um número inteiro.') })) id: number) { return this.service.remover(id); }
}
