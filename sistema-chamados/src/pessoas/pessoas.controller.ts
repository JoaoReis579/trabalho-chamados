import { BadRequestException, Body, Controller, Delete, Get, Param, ParseBoolPipe, ParseEnumPipe, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { PessoasService } from './pessoas.service.js';
import { CriarPessoaDto } from './dto/criar-pessoa.dto.js';
import { AtualizarPessoaDto } from './dto/atualizar-pessoa.dto.js';
import { FiltroPessoasDto } from './dto/filtro-pessoas.dto.js';
import { TipoPessoa } from '../generated/prisma/client.js';
@Controller('pessoas')
export class PessoasController {
  constructor(private readonly service: PessoasService) {}
  @Post() criar(@Body() dto: CriarPessoaDto) { return this.service.criar(dto); }
  @Get() listar(@Query('tipo', new ParseEnumPipe(TipoPessoa, { optional: true, exceptionFactory: () => new BadRequestException('O filtro tipo deve ser SOLICITANTE ou TECNICO.') })) tipo?: TipoPessoa, @Query('ativo', new ParseBoolPipe({ optional: true, exceptionFactory: () => new BadRequestException('O filtro ativo deve ser true ou false.') })) ativo?: unknown) { return this.service.listar({ tipo, ativo } as FiltroPessoasDto); }
  @Get(':id') buscar(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException('O ID da pessoa deve ser um número inteiro.') })) id: number) { return this.service.buscar(id); }
  @Patch(':id') atualizar(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException('O ID da pessoa deve ser um número inteiro.') })) id: number, @Body() dto: AtualizarPessoaDto) { return this.service.atualizar(id, dto); }
  @Delete(':id') remover(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException('O ID da pessoa deve ser um número inteiro.') })) id: number) { return this.service.remover(id); }
}
