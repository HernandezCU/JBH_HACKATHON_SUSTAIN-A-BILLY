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
deta = Deta("b0w5qqde_q1eby1Vb5sG5CzNd7QWjHBMprFhFfcny")

users_db = deta.Base("users")


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


@app.post("/register", response_class=HTMLResponse)
async def create_user(request: Request, response: Response, name: str = Form(...), email: str() = Form(...), password: str = Form(...)):

    j = users_db.fetch({"email": email.lower()})

    if j.count != 0: 
        response = templates.TemplateResponse("redirect.html", {"request": request, "url": "/"})
        return response

    else:
        try:
            p = password.encode()
            hashed_p = bcrypt.hashpw(p,"$2b$12$vj2GaHW10eRxDcJTTTAWI.".encode())
            key = secrets.token_urlsafe(12)

            u = {"key": key, "name": name, "email": email.lower(), "password": hashed_p.decode()}
            #x = User(Key=key, Username=username, Name=name, Password_enc=hashed_p.decode(), School=school, Age=age, Favorite_Color=fav_color)

            users_db.put(x.private())
            
            

            response.set_cookie(key="key", value=x.Key)
            return templates.TemplateResponse("index.html", {"request": request, "user": x.private(), "attendance": attendance_db.fetch({'user': x.Key}).items})


        except Exception as e:
            print(e)
            response = templates.TemplateResponse("redirect.html", {"request": request, "url": "/"})
            return response


#https://fastapi.tiangolo.com/es/advanced/custom-response/#redirectresponse
@app.get("/upc_lookup/{upc}", response_class=HTMLResponse)
async def upc_lookup(request: Request, upc: str):
    i_upc = upc 
    return "upc: " + upc


@app.api_route("/{path_name:path}", methods=["GET"]) #CATCH ALL ROUTES FOR 404 ADD 2 Diffent Pages Based on Cookie Saves to Browser or not
async def catch_all(request: Request, path_name: str):
    return "404 not found"


# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("main:app", host="localhost", reload=True)
    
