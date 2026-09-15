import { PrismaService } from '../../database/prisma.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { CourseResponseDto, CreateCourseDto, UpdateCourseDto } from './dto/learning-content.dto.js';
export declare class CoursesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateCourseDto): Promise<CourseResponseDto>;
    findAll(currentUser: CurrentUser): Promise<CourseResponseDto[]>;
    findOne(id: string, currentUser: CurrentUser): Promise<CourseResponseDto>;
    release(id: string, currentUser: CurrentUser): Promise<CourseResponseDto>;
    unrelease(id: string, currentUser: CurrentUser): Promise<CourseResponseDto>;
    update(id: string, dto: UpdateCourseDto, currentUser: CurrentUser): Promise<CourseResponseDto>;
    remove(id: string): Promise<void>;
    private canRelease;
    private assertReleaser;
    private toResponse;
}
