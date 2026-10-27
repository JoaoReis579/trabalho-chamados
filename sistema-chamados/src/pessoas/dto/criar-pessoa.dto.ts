import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { TipoPessoa } from '../../generated/prisma/client.js';

export class CriarPessoaDto {
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value) @IsString({ message: 'O nome deve ser um texto.' }) @IsNotEmpty({ message: 'O nome é obrigatório.' }) @MaxLength(120, { message: 'O nome deve ter no máximo 120 caracteres.' }) nome!: string;
  @IsEmail({}, { message: 'Informe um e-mail válido.' }) @MaxLength(254, { message: 'O e-mail deve ter no máximo 254 caracteres.' }) email!: string;
  @IsEnum(TipoPessoa, { message: 'O tipo deve ser SOLICITANTE ou TECNICO.' }) tipo!: TipoPessoa;
  @IsOptional() @IsBoolean({ message: 'O campo ativo deve ser booleano.' }) ativo?: boolean;
}
