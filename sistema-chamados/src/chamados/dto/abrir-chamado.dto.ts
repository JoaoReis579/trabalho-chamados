import { IsEnum, IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Prioridade } from '../../generated/prisma/client.js';
export class AbrirChamadoDto {
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value) @IsString({ message: 'O título deve ser um texto.' }) @MinLength(5, { message: 'O título deve ter no mínimo 5 caracteres.' }) @MaxLength(100, { message: 'O título deve ter no máximo 100 caracteres.' }) titulo!: string;
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value) @IsString({ message: 'A descrição deve ser um texto.' }) @MinLength(10, { message: 'A descrição deve ter no mínimo 10 caracteres.' }) descricao!: string;
  @IsOptional() @IsEnum(Prioridade, { message: 'A prioridade deve ser BAIXA, MEDIA, ALTA ou CRITICA.' }) prioridade?: Prioridade;
  @Type(() => Number) @IsInt({ message: 'O solicitanteId deve ser um número inteiro.' }) solicitanteId!: number;
  @Type(() => Number) @IsInt({ message: 'O tipoProblemaId deve ser um número inteiro.' }) tipoProblemaId!: number;
}
