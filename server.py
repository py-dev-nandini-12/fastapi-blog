
import os

import sqlalchemy
from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import Column, Integer, String, Text, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import databases
from starlette.responses import FileResponse

Base = declarative_base()


class BlogPost(Base):
    __tablename__ = 'blog'
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)


app = FastAPI()

# Database Configuration
DATABASE_URL = "postgresql://nandinichatterjee:postgresql_tutorial@localhost/events"
database = databases.Database(DATABASE_URL)
metadata = sqlalchemy.MetaData()

# SQLAlchemy Configuration
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# html_file_path = os.path.join(os.path.dirname(__file__), "templates/index.html")

#
# @app.get("/")
# async def read_root():
#     return FileResponse(html_file_path)


@app.post("/api/save_post")
async def save_post(data: dict, db: Session = Depends(get_db)):
    title = data.get('title')
    content = data.get('content')

    if title is None or content is None:
        raise HTTPException(status_code=422, detail='Title and content are required')

    post = BlogPost(title=title, content=content)
    db.add(post)
    db.commit()

    return {'message': 'Post saved successfully.'}


@app.get("/api/read_post/{post_id}")
async def read_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if post:
        return {'title': post.title, 'content': post.content}
    else:
        raise HTTPException(status_code=404, detail='Post not found.')


@app.delete("/api/delete_post/{post_id}")
async def delete_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if post:
        db.delete(post)
        db.commit()
        return {'message': 'Post deleted successfully.'}
    else:
        raise HTTPException(status_code=404, detail='Post not found.')


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8080)
