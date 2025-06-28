import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Container, Typography, CircularProgress, Alert } from "@mui/material";

const API_URL =
  "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=&apikey=SKBIPM4IZBQP115F";

export default function LandingPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        const data = res.data?.bestMatches ?? [];
        const parsed = data.map((d, idx) => ({
          id: idx,
          symbol: d["1. symbol"],
          name: d["2. name"],
          type: d["3. type"],
          region: d["4. region"],
          currency: d["8. currency"],
          matchScore: d["9. matchScore"],
        }));
        setRows(parsed);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  const columns = useMemo(
    () => [
      { field: "symbol", headerName: "Symbol", width: 120 },
      { field: "name", headerName: "Company", flex: 1 },
      { field: "type", headerName: "Type", width: 120 },
      { field: "region", headerName: "Region", width: 160 },
      { field: "currency", headerName: "Currency", width: 120 },
      { field: "matchScore", headerName: "Score", width: 100 },
    ],
    []
  );

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        X Portfolio Management
      </Typography>

      {loading && <CircularProgress />}
      {error && (
        <Alert severity="error">{error.message || "Failed to load data"}</Alert>
      )}

      {!loading && !error && (
        <div style={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            sx={{ backgroundColor: "#fff" }}
          />
        </div>
      )}
    </Container>
  );
}
