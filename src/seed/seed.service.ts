import { Injectable } from '@nestjs/common'
import axios, { AxiosInstance } from 'axios'
import { PokeResponse } from './interfaces/poke-response.interface'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Pokemon } from 'src/pokemon/entities/pokemon.entity'
import { AxiosAdapter } from 'src/common/adapters/axios.adapter'

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios

  constructor(
    @InjectModel('Pokemon')
    private readonly pokemonModel: Model<Pokemon>,
    
    private readonly http: AxiosAdapter
  ) {}

  async seedInit() {
    await this.pokemonModel.deleteMany({})

    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=151',
    )

    const insertPromisesArray: Promise<any>[] = []
    const pokemonToInsert: { name: string; number: number }[] = []

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/')
      const number: number = +segments[segments.length - 2]

      pokemonToInsert.push({ name, number })
    })

    await this.pokemonModel.insertMany(pokemonToInsert)

    return {
      success: true,
      message: 'Pokemon data seeded successfully',
    }
  }
}
