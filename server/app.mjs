import express from 'express';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createService } from './service.mjs';
import { recapCsv } from './csv.mjs';

export function createApp(pool, config, bank) {
  const app = express();
  const service = createService(pool, config, bank);
  app.disable('x-powered-by');
  app.use((req,res,next) => {
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Referrer-Policy','no-referrer');
    res.setHeader('Content-Security-Policy',"default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'");
    res.setHeader('X-Robots-Tag','noindex, nofollow');
    if (req.path.startsWith('/api')) res.setHeader('Cache-Control','no-store');
    next();
  });
  app.use(['/api/bank/validate','/api/bank/upload'],express.json({limit:'2mb'}));
  app.use('/api',express.json({limit:'32kb'}));
  app.use('/api',(req,res,next) => {
    const origin = req.get('origin');
    if (req.get('sec-fetch-site') === 'cross-site' || (origin && new URL(origin).host !== req.get('host'))) return res.status(403).json({error:'Asal permintaan tidak diizinkan.',status:403});
    next();
  });
  const execute = action => async (req,res) => {
    try {
      const data = await service.rpc(action,{...req.body,...req.params});
      if (data.error) return res.status(data.status).json(data);
      if (data.download) {
        res.setHeader('Content-Disposition',`attachment; filename="${data.filename}"`);
        return res.type(data.mime).send(data.download);
      }
      if (req.path === '/api/recap.csv') {
        res.setHeader('Content-Disposition','attachment; filename="Rekap_UAS_Daya_Pertanian.csv"');
        return res.type('text/csv; charset=utf-8').send(recapCsv(data.results));
      }
      res.json(data);
    } catch {
      const requestId = randomUUID();
      console.error('Quiz request failed',requestId);
      res.status(503).json({error:'Permintaan belum berhasil. Coba lagi.',status:503,requestId});
    }
  };
  app.post('/api/attempts',execute('start'));
  app.get('/api/attempts/:id',execute('get'));
  app.post('/api/attempts/:id/reset',execute('reset'));
  app.post('/api/attempts/:id/submit',execute('submit'));
  app.post('/api/recap',execute('recap'));
  app.post('/api/recap.csv',execute('recap'));
  app.post('/api/recap/delete',execute('delete'));
  for(const action of ['status','template','export','validate','upload']) app.post('/api/bank/'+action,execute('bank-'+action));
  app.post('/api/quiz/:action',(req,res,next) => execute(req.params.action)(req,res,next));
  app.use('/api',(req,res) => res.status(404).json({error:'Rute tidak ditemukan.',status:404}));
  app.get('/rekap',(req,res) => res.sendFile(fileURLToPath(new URL('../public/index.html',import.meta.url))));
  app.use(express.static(fileURLToPath(new URL('../public',import.meta.url))));
  app.use((error,req,res,next) => res.status(error.status === 413 ? 413 : 400).json({error:'Permintaan tidak valid.',status:error.status === 413 ? 413 : 400}));
  return app;
}
