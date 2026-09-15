import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { VersetzungswunschService } from "./versetzungswunsch.service.js";
@ApiTags("versetzungswunsch") @ApiBearerAuth() @Controller({path:"versetzungswunsch",version:"1"}) export class VersetzungswunschController {
  constructor(private s:VersetzungswunschService){}
  @Post() create(@Body() dto:any){return this.s.create(dto);}
  @Get() findAll(){return this.s.findAll();}
  @Get(":id") findOne(@Param("id") id:string){return this.s.findOne(id);}
}
