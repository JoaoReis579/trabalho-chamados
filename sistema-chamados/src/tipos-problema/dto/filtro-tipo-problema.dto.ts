import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
export class FiltroTipoProblemaDto {
  @IsOptional() @Transform(({ value }) => value === 'true' ? true : value === 'false' ? false : value) @IsBoolean({ message: 'O filtro ativo deve ser true ou false.' }) ativo?: boolean;
}
