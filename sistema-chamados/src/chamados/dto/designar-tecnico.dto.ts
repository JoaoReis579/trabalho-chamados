import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
export class DesignarTecnicoDto {
  @Type(() => Number) @IsInt({ message: 'tecnicoId deve ser um número inteiro.' }) @Min(1, { message: 'tecnicoId deve ser positivo.' }) tecnicoId!: number;
}
