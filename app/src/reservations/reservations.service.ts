import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateReservationDto) {
    return this.prisma.reservationRequest.create({
      data: {
        name: dto.name,
        email: dto.email,
        requestedFor: new Date(dto.requestedFor),
        notes: dto.notes,
      },
    });
  }
}
