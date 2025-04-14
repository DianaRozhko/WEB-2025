import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

import { Venue } from './venue.entity';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';

@Injectable()
export class VenueService {
  constructor(
    @InjectRepository(Venue)
    private venueRepository: Repository<Venue>,
  ) {}

  async create(createVenueDto: CreateVenueDto): Promise<Venue> {
    const venue = this.venueRepository.create(createVenueDto);
    try {
      return await this.venueRepository.save(venue);
    } catch (error) {
      throw new RpcException({
        statusCode: 500,
        message: 'Не вдалося створити майданчик',
      });
    }
  }

  async findAll(): Promise<Venue[]> {
    try {
      return await this.venueRepository.find();
    } catch (error) {
      throw new RpcException({
        statusCode: 500,
        message: 'Не вдалося отримати список майданчиків',
      });
    }
  }

  async findOne(id: string): Promise<Venue> {
    try {
      const venue = await this.venueRepository.findOne({ where: { id } });
      if (!venue) {
        throw new RpcException({
          statusCode: 404,
          message: 'Майданчик не знайдено',
        });
      }
      return venue;
    } catch (error) {
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        statusCode: 500,
        message: 'Помилка пошуку майданчика',
      });
    }
  }

  async update(id: string, updateVenueDto: UpdateVenueDto): Promise<Venue> {
    const venue = await this.findOne(id);
    console.log(updateVenueDto)
    Object.assign(venue, updateVenueDto);

    try {
      return await this.venueRepository.save(venue);
    } catch (error) {
      throw new RpcException({
        statusCode: 500,
        message: 'Не вдалося оновити майданчик',
      });
    }
  }

  async remove(id: string): Promise<string> {
    const venue = await this.findOne(id);
    try {
      await this.venueRepository.remove(venue);
      return  'Майданчик успішно видалено' ;
    } catch (error) {
      throw new RpcException({
        statusCode: 500,
        message: 'Не вдалося видалити майданчик',
      });
    }
  }
}
