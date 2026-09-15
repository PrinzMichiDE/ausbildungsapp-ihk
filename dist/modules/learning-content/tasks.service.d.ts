import { PrismaService } from '../../database/prisma.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { CreateTaskDto, TaskResponseDto, UpdateTaskDto } from './dto/learning-content.dto.js';
export declare class TasksService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateTaskDto): Promise<TaskResponseDto>;
    findAll(currentUser: CurrentUser): Promise<TaskResponseDto[]>;
    findOne(id: string, currentUser: CurrentUser): Promise<TaskResponseDto>;
    release(id: string, currentUser: CurrentUser): Promise<TaskResponseDto>;
    unrelease(id: string, currentUser: CurrentUser): Promise<TaskResponseDto>;
    update(id: string, dto: UpdateTaskDto, currentUser: CurrentUser): Promise<TaskResponseDto>;
    remove(id: string): Promise<void>;
    private canRelease;
    private assertReleaser;
    private toResponse;
}
