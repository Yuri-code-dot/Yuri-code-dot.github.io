# Arena Agent leaderboard source

- **Snapshot generated at:** 2026-07-27T20:41:20.908031+00:00
- **Preferred source (attempted first):** https://api.wulong.dev/arena-ai-leaderboards/v1/leaderboard?name=agent
- **Used source:** https://raw.githubusercontent.com/oolong-tea-2026/arena-ai-leaderboards/main/data/2026-07-27/agent.json
- **Archive repository citation:** https://github.com/oolong-tea-2026/arena-ai-leaderboards (community mirror, with attribution to kimiyoung Arena leaderboard ecosystem)

## Mapping decisions

Arena `agent.json` provides the dimensions below under each model's `scores` list. The benchmark file requires fixed keys, so we mapped high-confidence dimensions and kept all original score dimensions in `rawMetrics`.

- `Confirmed Success` → `accuracy`
- `Net Improvement` → `reasoning`
- `Bash Recovery` → `coding`
- `Steerability` → `instruction`
- `Tool Hallucination` → `halluc` (inverted to resistance with `100 - Tool Hallucination`)
- `Praise vs Complaint` → `safety`

Fields with no direct source metric in this snapshot are set to `0`: `latency`, `calibration`, `visual`, `handwriting`, `codeToTalk`.

## Notes

- Preferred API DNS lookup failed in the current environment, so the GitHub mirror snapshot was used.
- Run local validation after updates:

```bash
node tools/validate-models.js
```
