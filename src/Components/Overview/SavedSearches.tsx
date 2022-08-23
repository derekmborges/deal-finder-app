import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { SavedSearch } from '@mui/icons-material';



export default function SavedSearches() {
  const [searches, setSavedSearches] = useState<SavedSearch[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getSavedSearches = async () => {
    const response = await axios.get('https://homedepotdealfinder.derekmborges.repl.co/api/searches');
    if (response.status === 200) {
      console.log(response.data);
      setSavedSearches(response.data.map((r: any) => {
        return {
          searchPhrase: r.phrase,
          categories: r.categories
        } as SavedSearch
      }))
    }
    setLoading(false);
  }

  useEffect(() => {
    getSavedSearches();
  }, []);

  return (
    <React.Fragment>
      <Title>Saved Searches</Title>
      {searches === null && loading ? (
        <CircularProgress />
      ) : !loading && searches ? (

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Phrase</TableCell>
            <TableCell>Categories</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {searches.map((search, i) => (
            <TableRow key={i}>
              <TableCell>{search.searchPhrase}</TableCell>
              <TableCell>{search.categories.join(", ")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      ) : null}

    </React.Fragment>
  );
}