import { IsInt, IsPositive, Min, IsString, MinLength } from 'class-validator'

export class CreatePokemonDto {
  @IsString()
  @MinLength(1)
  name: string

  @IsInt()
  @IsPositive()
  @Min(1)
  number: number
}
