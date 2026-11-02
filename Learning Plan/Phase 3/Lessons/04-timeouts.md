# Lesson 4: Timeouts

> “When does waiting become a failure, and who owns that clock?” — Tina “Timeout Tamer” Torres, Developer

A timeout is a deadline that turns excessive waiting into a clear outcome. Step, case, and run deadlines cover different scopes and should not be confused with ordinary action waits.

The closest useful boundary should report the timeout while cleanup still runs. Error details should say which deadline expired.

## Try it

For a slow page action, compare what happens when its step timeout, case timeout, or run timeout expires first.

## You are ready when

You can place deadlines at the right level and preserve a useful primary failure.
