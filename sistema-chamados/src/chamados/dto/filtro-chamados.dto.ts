import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { Prioridade, SituacaoChamado } from '../../generated/prisma/client.js';
export class FiltroChamadosDto {
  @IsOptional() @IsEnum(SituacaoChamado, { message: 'Situação inválida.' }) situacao?: SituacaoChamado;
  @IsOptional() @IsEnum(Prioridade, { message: 'Prioridade inválida.' }) prioridade?: Prioridade;
  @IsOptional() @Type(() => Number) @IsInt({ message: 'tipoProblemaId deve ser um número inteiro.' }) @Min(1, { message: 'tipoProblemaId deve ser positivo.' }) tipoProblemaId?: number;
  @IsOptional() @Type(() => Number) @IsInt({ message: 'tecnicoId deve ser um número inteiro.' }) @Min(1, { message: 'tecnicoId deve ser positivo.' }) tecnicoId?: number;
}
