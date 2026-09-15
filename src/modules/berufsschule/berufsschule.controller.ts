import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { BerufsschuleService } from "./berufsschule.service.js";
@ApiTags("berufsschule") @ApiBearerAuth() @Controller({path:"berufsschule",version:"1"}) export class BerufsschuleController {
  constructor(private s:BerufsschuleService){}
  @Post() create(@Body() dto:any){return this.s.create(dto);}
  @Get() findAll(){return this.s.findAll();}
  @Get(":id") findOne(@Param("id") id:string){return this.s.findOne(id);}
}
