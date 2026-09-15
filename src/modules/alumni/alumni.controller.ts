import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { AlumniService } from "./alumni.service.js";
@ApiTags("alumni") @ApiBearerAuth() @Controller({path:"alumni",version:"1"}) export class AlumniController {
  constructor(private s:AlumniService){}
  @Post() create(@Body() dto:any){return this.s.create(dto);}
  @Get() findAll(){return this.s.findAll();}
  @Get(":id") findOne(@Param("id") id:string){return this.s.findOne(id);}
}
