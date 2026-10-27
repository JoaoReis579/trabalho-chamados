import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { SituacaoChamado } from '../../generated/prisma/client.js';
export class AlterarSituacaoDto {
  @IsEnum(SituacaoChamado, { message: 'Situação inválida.' }) situacao!: SituacaoChamado;
  @IsOptional() @Type(() => Number) @IsInt({ message: 'usuarioId deve ser um número inteiro.' }) @Min(1, { message: 'usuarioId deve ser positivo.' }) usuarioId?: number;
}
