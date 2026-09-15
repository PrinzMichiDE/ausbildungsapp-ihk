import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service.js';
@ApiTags('search') @Controller({path:'search',version:'1'}) export class SearchController{ constructor(private s:SearchService){} @Get() search(@Query('q') q:string){ return this.s.search(q??''); } }
