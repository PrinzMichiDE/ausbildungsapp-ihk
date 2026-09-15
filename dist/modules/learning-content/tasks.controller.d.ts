import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { TasksService } from './tasks.service.js';
import { CreateTaskDto, TaskResponseDto, UpdateTaskDto } from './dto/learning-content.dto.js';
export declare class TasksController {
    private readonly service;
    constructor(service: TasksService);
    create(dto: CreateTaskDto): Promise<TaskResponseDto>;
    findAll(user: CurrentUser): Promise<TaskResponseDto[]>;
    findOne(id: string, user: CurrentUser): Promise<TaskResponseDto>;
    update(id: string, dto: UpdateTaskDto, user: CurrentUser): Promise<TaskResponseDto>;
    release(id: string, user: CurrentUser): Promise<TaskResponseDto>;
    unrelease(id: string, user: CurrentUser): Promise<TaskResponseDto>;
    remove(id: string): Promise<void>;
}
