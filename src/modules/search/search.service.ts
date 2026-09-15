import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService){}
  async search(q:string){
    const like = `%${q}%`;
    const [reports, wiki, courses] = await Promise.all([
      this.prisma.report.findMany({ where:{ titel:{ contains:q, mode:'insensitive'}}, take:10 }),
      this.prisma.wikiPage.findMany({ where:{ titel:{ contains:q, mode:'insensitive'}}, take:10 }),
      this.prisma.course.findMany({ where:{ titel:{ contains:q, mode:'insensitive'}}, take:10 }),
    ]);
    return { reports, wiki, courses };
  }
}
