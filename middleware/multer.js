import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination : function (req,file ,cb){
        cb(null,path.join(__dirname,'../uploads'))
    },
    filename : function(req,file,cb){
        const ext = path.extname(file.originalname)
        const fileName = Date.now() + '_' + file.originalname;
        cb(null,fileName)
    }

});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp ,image/avif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpeg, .png, .webp files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 
  }
});

export default upload