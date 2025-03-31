import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    } catch {
      throw new InternalServerErrorException('Не вдалося створити майданчик');
    }
  }

  async findAll(): Promise<Venue[]> {
    try {
      return await this.venueRepository.find();
    } catch {
      throw new InternalServerErrorException('Не вдалося отримати майданчики');
    }
  }

  async findOne(id: string): Promise<Venue> {
    const venue = await this.venueRepository.findOne({ where: { id } });
    if (!venue) {
      throw new NotFoundException('Майданчик не знайдено');
    }
    return venue;
  }

  async update(id: string, updateVenueDto: UpdateVenueDto): Promise<Venue> {
    const venue = await this.findOne(id);
    Object.assign(venue, updateVenueDto);

    try {
      return await this.venueRepository.save(venue);
    } catch {
      throw new InternalServerErrorException('Не вдалося оновити майданчик');
    }
  }

  async remove(id: string): Promise<void> {
    const venue = await this.findOne(id);
    try {
      await this.venueRepository.remove(venue);
    } catch {
      throw new InternalServerErrorException('Не вдалося видалити майданчик');
    }
  }
}
