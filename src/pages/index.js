
import React, {useState} from "react";
import ReactDOM from "react-dom/client";
import app from "./_app";
import { createTheme, Paper, Box, Button, Container, Typography, IconButton, TextField } from "@mui/material";
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItem,Pagination, ListItemText, InputAdornment  } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LanguageIcon from '@mui/icons-material/Language';
import { Grid } from '@mui/material';
import books from '../data/books.json';



const openInNewTab = (url) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};





export default function App(){

  const [favorites, setFavorites] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState([]);
  const [countryFilter, setCountryFilter] = useState('');
  const [pageRangeFilter, setPageRangeFilter] = useState('');
  const [centuryFilter, setCenturyFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const booksPerPage = 20;

  const toggleFavorite = (title) => {
    setFavorites(prevFavorites => ({
      ...prevFavorites,
      [title]: !prevFavorites[title]
    }));
  };

  const filteredBooks = books.filter((book) => {
    const titleMatches = book.title.toLowerCase().includes(searchQuery.toLowerCase());
    const authorMatches = book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const languageMatches = languageFilter.length === 0 || languageFilter.includes(book.language);
    const countryMatches = !countryFilter || book.country === countryFilter;

    const pageMatches = !pageRangeFilter || (
      (pageRangeFilter === '1-100' && book.pages <= 100) ||
      (pageRangeFilter === '101-200' && book.pages > 100 && book.pages <= 200) ||
      (pageRangeFilter === '201-300' && book.pages > 200 && book.pages <= 300) ||
      (pageRangeFilter === '301+' && book.pages > 300)
    );

    const centuryMatches = !centuryFilter || (
      (centuryFilter === '16th' && book.year >= 1501 && book.year <= 1600) ||
      (centuryFilter === '17th' && book.year >= 1601 && book.year <= 1700) ||
      (centuryFilter === '18th' && book.year >= 1701 && book.year <= 1800) ||
      (centuryFilter === '19th' && book.year >= 1801 && book.year <= 1900) ||
      (centuryFilter === '20th' && book.year >= 1901 && book.year <= 2000) ||
      (centuryFilter === '21st' && book.year >= 2001)
    );

    return (titleMatches || authorMatches) && languageMatches && countryMatches && pageMatches && centuryMatches;
  });

  const uniqueLanguages = [...new Set(books.map(book => book.language))];
  const uniqueCountries = [...new Set(books.map(book => book.country))];
  
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const booksToDisplay = filteredBooks.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Typography
          variant="h2"
          sx={{ 
            my: 4, 
            textAlign: "left", 
            
            fontWeight: 'bold',
        
            textShadow: '2px 2px 8px rgba(0,0,0,0.6)',
            fontFamily: 'Arial, sans-serif',
            letterSpacing: 1.5,
            marginLeft: '10%', 
          }}
        > 
          Taher's Book Viewer
        </Typography>
      </Box>

      <Container maxWidth="xl">

        <Paper 
          sx={{ 
            p: 1,
            borderRadius: 1, 
            elevation: 3, 
            display: 'flex', 
            justifyContent: 'center',
            mr: 2,
            marginBottom: 0
            
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 600 }}>
            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Paper>

        <Grid container> 
        
          <Grid item xs={3} sx={{ marginTop: 3 }}>
            <Paper sx={{ mb: 2, position: 'relative'  }} elevation={3}> 
              <Box sx={{ p: 2, backgroundColor: 'white', height: '100vh' }}>
              
                  {/* Search Filter*/}
                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                  <InputLabel>Language</InputLabel>
                  <Select
                    multiple
                    value={languageFilter}
                    onChange={(e) => setLanguageFilter(e.target.value)}
                    renderValue={(selected) => selected.join(', ')}
                    label="Language"
                  >
                    {uniqueLanguages.map((language) => (
                      <MenuItem key={language} value={language}>
                        <Checkbox checked={languageFilter.indexOf(language) > -1} />
                        <ListItemText primary={language} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                  <InputLabel>Country</InputLabel>
                  <Select
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    label="Country"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {uniqueCountries.map((country) => (
                      <MenuItem key={country} value={country}>
                        {country}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                  <InputLabel>Pages</InputLabel>
                  <Select
                    value={pageRangeFilter}
                    onChange={(e) => setPageRangeFilter(e.target.value)}
                    label="Pages"
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    <MenuItem value="1-100">1-100 pages</MenuItem>
                    <MenuItem value="101-200">101-200 pages</MenuItem>
                    <MenuItem value="201-300">201-300 pages</MenuItem>
                    <MenuItem value="301+">301+ pages</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                  <InputLabel>Century</InputLabel>
                  <Select
                    value={centuryFilter}
                    onChange={(e) => setCenturyFilter(e.target.value)}
                    label="Century"
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    <MenuItem value="16th">16th century</MenuItem>
                    <MenuItem value="17th">17th century</MenuItem>
                    <MenuItem value="18th">18th century</MenuItem>
                    <MenuItem value="19th">19th century</MenuItem>
                    <MenuItem value="20th">20th century</MenuItem>
                    <MenuItem value="21st">21st century</MenuItem>
                  </Select>
                </FormControl>
                
              </Box>
            </Paper>
          </Grid>

          <Grid item xs= {9}> 

            <Box sx={{ my: 1 }} />

            <Box sx={{ p: 2 }}>





            {booksToDisplay.map((book) => (
              <Paper key={book.title} sx={{ p: 2,  mb: 2, position: 'relative'  }} elevation={3}>
                <IconButton
                  sx={{ position: 'absolute', top: 8, right: 8, color: favorites[book.title] ? 'red' : 'grey' }}
                  onClick={() => toggleFavorite(book.title)}
                >
                  {favorites[book.title] ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <img src={book.imageLink} alt={book.title} style={{ width: 130, height: 195 }} />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="h5" style={{ fontWeight: 'bold' }} >{book.title}</Typography>
                    <Typography variant="h6">{book.author}</Typography>
                    <Typography style={{ fontWeight: 'bold' }} sx={{ color: 'grey', textAlign: 'left' }} ><LanguageIcon style={{ verticalAlign: 'middle' }} />{book.language}</Typography>
                    
                    <Grid container justifyContent="flex-end">
                      <Grid item xs={12}>
                        <Grid container >
                          <Grid item xs={12}>
                            <Typography sx={{ color: 'grey', textAlign: 'right' }}>{book.country}</Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography sx={{ color: 'grey', textAlign: 'right' }}>Year: {book.year}</Typography>
                          </Grid>
                          <Grid item xs={12} sx={{ textAlign: 'right' }}>
                            <Typography sx={{ color: 'grey' }}>Pages: {book.pages}</Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      sx={{ mt: 2 }} 
                      onClick={() => openInNewTab(book.link)}
                      endIcon={<OpenInNewIcon />}
                    >
                      Learn more
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                variant="outlined"
                shape="rounded"
              />
            </Box>
            </Grid>


        </Grid>

      </Container>


    </div>
  );
}

