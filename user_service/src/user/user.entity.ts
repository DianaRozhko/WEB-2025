// user-service/src/user/user.entity.ts

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')  // Декларуємо, що ця сутність відповідає таблиці "users" у базі даних
export class User {
  @PrimaryGeneratedColumn('uuid')
  // Поле id генерується автоматично як UUID
  id: string;

  @Column()
  // Поле name зберігає ім'я користувача
  name: string;

  @Column({ unique: true })
  // Поле email повинно бути унікальним для кожного користувача
  email: string;
  
  @Column()
  // Поле password зберігає хешований пароль користувача
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // Поле created_at зберігає дату створення користувача
  created_at: Date;
}
