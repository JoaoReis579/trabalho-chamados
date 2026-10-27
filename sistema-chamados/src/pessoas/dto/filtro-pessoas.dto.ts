import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { TipoPessoa } from '../../generated/prisma/client.js';
export class FiltroPessoasDto {
  @IsOptional() @IsEnum(TipoPessoa, { message: 'O tipo deve ser SOLICITANTE ou TECNICO.' }) tipo?: TipoPessoa;
  @IsOptional() @Transform(({ value }) => value === 'true' ? true : value === 'false' ? false : value) @IsBoolean({ message: 'O filtro ativo deve ser true ou false.' }) ativo?: boolean;
}
