//user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')  // Таблиця буде називатися 'users'
export class User {
  @PrimaryGeneratedColumn('uuid')  // Використовуємо UUID для унікального ідентифікатора
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;
  
  @Column()
  password: string;  // Тут зберігається зашифрований пароль

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
