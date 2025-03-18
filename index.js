const { projectsData } = require('./data.js');

function searchProjects(query) {
  return projectsData.filter(project => {
    const searchText = query.toLowerCase();
    return (
      project.title.toLowerCase().includes(searchText) ||
      project.category.some(cat => cat.toLowerCase().includes(searchText)) ||
      project.tech.some(tech => tech.toLowerCase().includes(searchText))
    );
  });
}

function performSearch() {
  const query = document.getElementById('searchInput').value;
  const results = searchProjects(query);
  displayResults(results);
}

function displayResults(results) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';
  results.forEach(project => {
    const projectDiv = document.createElement('div');
    projectDiv.innerHTML = `
      <h3>${project.title}</h3>
      <p>Type: ${project.type}</p>
      <p>Category: ${project.category.join(', ')}</p>
      <p>Tech: ${project.tech.join(', ')}</p>
      <p>Date Published: ${project.datePublished}</p>
      <a href="${project.projectURL}" target="_blank">Project Link</a>
    `;
    resultsDiv.appendChild(projectDiv);
  });
}

module.exports = { searchProjects, performSearch, displayResults };