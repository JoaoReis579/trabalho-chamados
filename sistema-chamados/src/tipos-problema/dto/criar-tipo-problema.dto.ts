import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
export class CriarTipoProblemaDto {
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value) @IsString({ message: 'O nome deve ser um texto.' }) @IsNotEmpty({ message: 'O nome é obrigatório.' }) @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres.' }) nome!: string;
  @IsOptional() @IsBoolean({ message: 'O campo ativo deve ser booleano.' }) ativo?: boolean;
}
