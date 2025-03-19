import { CommonModule } from './common/common.module'
import { ConfigModule } from '@nestjs/config'
import { join } from 'path'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PokemonModule } from './pokemon/pokemon.module'
import { SeedModule } from './seed/seed.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { EnvConfiguration } from './config/app.config'
import { JoiValidationSchema } from './config/joi.validation'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema 
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MongooseModule.forRoot(process.env.MONGO_DB as string, {
      dbName: 'pokedex-apiv2'
    }),
    PokemonModule,
    CommonModule,
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}