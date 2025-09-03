import express from 'express';
import { Orchestrator } from '../orchestrator';

const app = express();
app.use(express.json());

const orchestrator = new Orchestrator();

app.post('/event', async (req, res) => {
  const { topic, data } = req.body;
  orchestrator.getBus().emit(topic, data);
  res.status(204).end();
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`orchestrator-svc listening on port ${port}`);
});
