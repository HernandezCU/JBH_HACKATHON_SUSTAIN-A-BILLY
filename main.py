#from dateutil import parser
from datetime import date, datetime as dt
from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, FileResponse
from deta import Deta
import secrets
import bcrypt
deta = Deta("b09dkkrb_md4d6tpUjW7bfc3hsESbN2frKHyPtWLS")

attendance_db = deta.Base("checkins")
users_db = deta.Base("users")
#Project Key: mw61ps


app = FastAPI()
#app.mount("/assets", StaticFiles(directory="assets"), name="assets")

templates = Jinja2Templates(directory="templates")

#users = APIRouter(prefix="/users")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# @app.get('/favicon.ico', response_class=FileResponse)
# async def favicon():
#     return FileResponse('assets/favicon.ico')

@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return "Welcome this works!"

#https://fastapi.tiangolo.com/es/advanced/custom-response/#redirectresponse
@app.get("/upc_lookup/{upc}", response_class=HTMLResponse)
async def upc_lookup(request: Request, upc: str):
    i_upc = upc 
    return "upc: " + upc
    
@app.get("/test", response_class=HTMLResponse)
async def test(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.api_route("/{path_name:path}", methods=["GET"]) #CATCH ALL ROUTES FOR 404 ADD 2 Diffent Pages Based on Cookie Saves to Browser or not
async def catch_all(request: Request, path_name: str):
    return "404 not found"


# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("main:app", host="localhost", reload=True)
    
