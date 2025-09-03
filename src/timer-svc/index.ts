import express from 'express';
import { scheduleSkim } from './schedule';
import { Orchestrator } from '../orchestrator';

const app = express();
app.use(express.json());

const orchestrator = new Orchestrator();
const bus = orchestrator.getBus();

app.post('/skim', (req, res) => {
  const { positionId, periodDays } = req.body;
  scheduleSkim(bus, positionId, periodDays);
  res.status(204).end();
});

const port = process.env.PORT || 8081;
app.listen(port, () => console.log(`timer-svc listening on ${port}`));
