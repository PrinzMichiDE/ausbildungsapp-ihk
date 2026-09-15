import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { CoursesService } from './courses.service.js';
import { CourseResponseDto, CreateCourseDto, UpdateCourseDto } from './dto/learning-content.dto.js';
export declare class CoursesController {
    private readonly service;
    constructor(service: CoursesService);
    create(dto: CreateCourseDto): Promise<CourseResponseDto>;
    findAll(user: CurrentUser): Promise<CourseResponseDto[]>;
    findOne(id: string, user: CurrentUser): Promise<CourseResponseDto>;
    update(id: string, dto: UpdateCourseDto, user: CurrentUser): Promise<CourseResponseDto>;
    release(id: string, user: CurrentUser): Promise<CourseResponseDto>;
    unrelease(id: string, user: CurrentUser): Promise<CourseResponseDto>;
    remove(id: string): Promise<void>;
}
