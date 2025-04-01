from fastapi import FastAPI, HTTPException, Query, Depends
from sqlalchemy.orm import Session
from . utils import perform_translation
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi import Request
from . database import Base,get_db,engine,SessionLocal
from . models import Translation
from .schemas import TranslationRequest


app = FastAPI(
    title="Universal Translation Service",
    description="Translate text to multiple languages",
    version="1.0.0"
)

app.mount('/static',StaticFiles(directory='app/static'),name='static')
templates=Jinja2Templates(directory='app/templates')

@app.get('/index')
async def read_root(request:Request):
    return templates.TemplateResponse('index.html',{"request":request})



Base.metadata.create_all(bind=engine)





@app.post("/translate")
async def translate(request: TranslationRequest, db: Session = Depends(get_db)):
    if not request.target_languages.strip():
        raise HTTPException(status_code=404, detail="Target languages cannot be empty")
    
    try:
        target_languages = [lang.strip() for lang in request.target_languages.split(",")]
        translations_dict = {
            "original_text": request.text,
            "translations": {}
        }
        
        for language in target_languages:
            translated_text = perform_translation(request.text, language)
            translations_dict["translations"][language] = translated_text
        
        translation_record = Translation(
            original_text=request.text,
            translations=str(translations_dict["translations"])  
        )
        
        db.add(translation_record)
        db.commit()
        db.refresh(translation_record)
        
        return {"id": translation_record.id, "translations": translations_dict["translations"]}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")

@app.get("/translations")
async def get_translations(
    id: int = Query(None, description="Filter translations by ID"),
    target_language: str = Query(None, description="Filter by target language"),
    db: Session = Depends(get_db)
):
    query = db.query(Translation)
    
    if id is not None:
        query = query.filter(Translation.id == id)
    
    translations = query.all()
    
    if not translations:
        raise HTTPException(status_code=404, detail="Translations not found.")
    
    translation = translations[0]
    translations_dict = eval(translation.translations)  # Convert back from string to dict
    
    if target_language:
        translated_text = translations_dict.get(target_language)
        if translated_text:
            return {"id": translation.id, "target_language": target_language, "translated_text": translated_text}
        else:
            raise HTTPException(status_code=404, detail="Translation for the specified language not found.")
    
    return {"id": translation.id, "original_text": translation.original_text, "translations": translations_dict}
