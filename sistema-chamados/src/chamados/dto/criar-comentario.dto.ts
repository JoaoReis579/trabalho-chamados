import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Matches, Min } from 'class-validator';
export class CriarComentarioDto {
  @Type(() => Number) @IsInt({ message: 'autorId deve ser um número inteiro.' }) @Min(1, { message: 'autorId deve ser positivo.' }) autorId!: number;
  @IsString({ message: 'O texto deve ser um texto.' }) @IsNotEmpty({ message: 'O comentário não pode estar vazio.' }) @Matches(/\S/, { message: 'O comentário não pode conter apenas espaços.' }) texto!: string;
}
