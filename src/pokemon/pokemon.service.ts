import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { CreatePokemonDto } from './dto/create-pokemon.dto'
import { UpdatePokemonDto } from './dto/update-pokemon.dto'
import { InjectModel } from '@nestjs/mongoose'
import { isValidObjectId, Model } from 'mongoose'
import { Pokemon } from './entities/pokemon.entity'
import { PaginationDto } from 'src/common/dtos/Pagination.dto'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class PokemonService {
  private defaultLimit: number

  constructor(
    @InjectModel('Pokemon')
    private readonly pokemonModel: Model<Pokemon>,
 
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = configService.get<number>('defaultLimit') ?? 151
    console.log(this.defaultLimit)
  }

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      createPokemonDto.name = createPokemonDto.name.toLowerCase()
      const pokemon = await this.pokemonModel.create(createPokemonDto)
      return pokemon
    } catch (err) {
      this.handleExceptions(err)
    }
  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = this.defaultLimit, offset = 0 } = paginationDto
    return await this.pokemonModel.find()
      .limit(limit).skip(offset).sort({number: 1}).select('-__v')
  }

  async findOne(term: string) {
    let pokemon
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ number: term })
    }

    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term)
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      })
    }

    if (!pokemon)
      throw new NotFoundException(
        `Pokemon with id, name or number: ${term} not found`,
      )
    return pokemon
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term)
    if (UpdatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name?.toLowerCase()
    }

    try {
      await pokemon.updateOne(updatePokemonDto, { new: true })
      return { ...pokemon.toJSON(), ...updatePokemonDto }
    } catch (err) {
      this.handleExceptions(err)
    }
  }

  async remove(id: string) {
    //return await this.pokemonModel.findByIdAndDelete(id)
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id })
    if (deletedCount === 0)
      throw new NotFoundException(`Pokemon with id: ${id} not found`)
    return { success: true }
  }

  private handleExceptions(err: any) {
    if (err.code === 11000) {
      throw new BadRequestException(
        `Pokemon ${JSON.stringify(err.keyValue)} already exists`,
      )
    }
    console.log(err)
    throw new InternalServerErrorException(
      'Cant create pokemon, check server logs',
    )
  }
}
