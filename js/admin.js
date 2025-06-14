// Admin panel JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminPanel();
});

// Use the global data manager
const dataManager = window.fcWolvesDataManager;
let teamData = {};

function initializeAdminPanel() {
    loadTeamData();
    updateStats();
    loadPlayersTable();
    loadScheduleForm();
    loadTeamStatus();
    initializeLineupBuilder();
    
    // Set up form event listeners
    setupEventListeners();
    
    // Listen for data changes
    window.addEventListener('fcWolvesDataChanged', function(e) {
        console.log('Data changed, refreshing admin panel...', e.detail);
        if (e.detail.source !== 'admin') {
            refreshAdminData();
        }
    });
}

function refreshAdminData() {
    loadTeamData();
    updateStats();
    loadPlayersTable();
    loadScheduleForm();
    loadTeamStatus();
    generateLineupSlots();
}

function loadTeamData() {
    teamData = dataManager.getData();
}

function saveTeamData() {
    try {
        dataManager.saveData(teamData);
        showNotification('Data saved successfully!', 'success');
    } catch (error) {
        showNotification('Error saving data: ' + error.message, 'error');
    }
}

function setupEventListeners() {
    // Add player form
    document.getElementById('addPlayerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addPlayer();
    });
    
    // Edit player form
    document.getElementById('editPlayerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        savePlayerEdit();
    });
    
    // Schedule form
    document.getElementById('scheduleForm').addEventListener('submit', function(e) {
        e.preventDefault();
        updateSchedule();
    });
    
    // Smooth scrolling for navigation
    document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function updateStats() {
    document.getElementById('totalPlayers').textContent = teamData.players.length;
    
    // Count active lineup players (non-null)
    const activeLineupCount = teamData.lineup.filter(player => player !== null).length;
    document.getElementById('activeLineup').textContent = activeLineupCount;
    
    // Calculate days to next match
    const now = new Date();
    const matchDate = new Date(teamData.nextMatch.date);
    const diffTime = matchDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    document.getElementById('nextMatchDays').textContent = Math.max(0, diffDays);
}

// Tab functionality
function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Player management functions
function addPlayer() {
    const number = parseInt(document.getElementById('playerNumber').value);
    const name = document.getElementById('playerName').value;
    const position = document.getElementById('playerPosition').value;
    const image = document.getElementById('playerImage').value;
    
    try {
        const newPlayer = { number, name, position, image };
        dataManager.addPlayer(newPlayer);
        
        // Refresh local data
        loadTeamData();
        loadPlayersTable();
        updateStats();
        
        // Reset form
        document.getElementById('addPlayerForm').reset();
        showNotification('Player added successfully!', 'success');
        
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
}

function loadPlayersTable() {
    const tbody = document.getElementById('playersTableBody');
    tbody.innerHTML = '';
    
    teamData.players.forEach((player, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${player.number}</td>
            <td>${player.name}</td>
            <td>${player.position}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editPlayer(${index})">Edit</button>
                    <button class="delete-btn" onclick="deletePlayer(${index})">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editPlayer(index) {
    const player = teamData.players[index];
    
    document.getElementById('editPlayerIndex').value = index;
    document.getElementById('editPlayerNumber').value = player.number;
    document.getElementById('editPlayerName').value = player.name;
    document.getElementById('editPlayerPosition').value = player.position;
    document.getElementById('editPlayerImage').value = player.image || '';
    
    document.getElementById('editPlayerModal').style.display = 'block';
}

function savePlayerEdit() {
    const index = parseInt(document.getElementById('editPlayerIndex').value);
    const number = parseInt(document.getElementById('editPlayerNumber').value);
    const name = document.getElementById('editPlayerName').value;
    const position = document.getElementById('editPlayerPosition').value;
    const image = document.getElementById('editPlayerImage').value;
    
    try {
        const updatedPlayer = { number, name, position, image };
        dataManager.updatePlayer(index, updatedPlayer);
        
        // Refresh local data
        loadTeamData();
        loadPlayersTable();
        generateLineupSlots(); // Refresh lineup in case player was updated
        
        closeEditModal();
        showNotification('Player updated successfully!', 'success');
        
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
}

function deletePlayer(index) {
    if (confirm('Are you sure you want to delete this player?')) {
        try {
            dataManager.deletePlayer(index);
            
            // Refresh local data
            loadTeamData();
            loadPlayersTable();
            updateStats();
            generateLineupSlots(); // Refresh lineup
            
            showNotification('Player deleted successfully!', 'success');
            
        } catch (error) {
            showNotification('Error: ' + error.message, 'error');
        }
    }
}

function closeEditModal() {
    document.getElementById('editPlayerModal').style.display = 'none';
}

// Lineup management functions
function initializeLineupBuilder() {
    generateLineupSlots();
}

function generateLineupSlots() {
    const lineupBuilder = document.querySelector('.position-slots');
    lineupBuilder.innerHTML = '';
    
    const formations = {
        '4-3-3': ['GK', 'RB', 'CB', 'CB', 'LB', 'CDM', 'CM', 'CAM', 'RW', 'ST', 'LW'],
        '4-4-2': ['GK', 'RB', 'CB', 'CB', 'LB', 'RM', 'CM', 'CM', 'LM', 'ST', 'ST'],
        '3-5-2': ['GK', 'CB', 'CB', 'CB', 'RWB', 'CM', 'CM', 'CM', 'LWB', 'ST', 'ST'],
        '4-2-3-1': ['GK', 'RB', 'CB', 'CB', 'LB', 'CDM', 'CDM', 'CAM', 'CAM', 'CAM', 'ST']
    };
    
    const currentFormation = teamData.formation || '4-3-3';
    const positions = formations[currentFormation];
    
    // Update formation selector
    document.getElementById('formationSelect').value = currentFormation;
    
    positions.forEach((position, index) => {
        const slot = document.createElement('div');
        slot.className = 'position-slot';
        slot.dataset.position = position;
        slot.dataset.index = index;
        
        // Check if position is filled
        const assignedPlayer = teamData.lineup[index];
        if (assignedPlayer && assignedPlayer !== null) {
            slot.classList.add('filled');
            slot.innerHTML = `
                <div class="player-number">#${assignedPlayer.number}</div>
                <div class="player-name">${assignedPlayer.name}</div>
                <div class="position-label">${position}</div>
            `;
        } else {
            slot.innerHTML = `
                <div class="position-label">${position}</div>
                <div class="empty-slot">Click to assign</div>
            `;
        }
        
        slot.addEventListener('click', () => selectPlayerForPosition(index, position));
        lineupBuilder.appendChild(slot);
    });
}

function selectPlayerForPosition(slotIndex, position) {
    const availablePlayers = teamData.players.filter(player => 
        !teamData.lineup.some(lineupPlayer => lineupPlayer && lineupPlayer.number === player.number) ||
        (teamData.lineup[slotIndex] && teamData.lineup[slotIndex].number === player.number)
    );
    
    if (availablePlayers.length === 0) {
        showNotification('No available players!', 'error');
        return;
    }
    
    const playerOptions = availablePlayers.map(player => 
        `<option value="${player.number}" ${teamData.lineup[slotIndex] && teamData.lineup[slotIndex].number === player.number ? 'selected' : ''}>
            #${player.number} - ${player.name} (${player.position})
        </option>`
    ).join('');
    
    const selectHTML = `
        <select id="playerSelect" class="player-select">
            <option value="">Remove Player</option>
            ${playerOptions}
        </select>
        <button onclick="assignPlayer(${slotIndex}, '${position}')">Assign</button>
        <button onclick="generateLineupSlots()">Cancel</button>
    `;
    
    const slot = document.querySelector(`[data-index="${slotIndex}"]`);
    slot.innerHTML = selectHTML;
}

function assignPlayer(slotIndex, position) {
    const selectElement = document.getElementById('playerSelect');
    const playerNumber = parseInt(selectElement.value);
    
    if (!playerNumber) {
        // Remove player from lineup
        teamData.lineup[slotIndex] = null;
    } else {
        const player = teamData.players.find(p => p.number === playerNumber);
        if (player) {
            // Remove player from any other position first
            teamData.lineup = teamData.lineup.map(lineupPlayer => 
                lineupPlayer && lineupPlayer.number === playerNumber ? null : lineupPlayer
            );
            
            // Assign to new position
            teamData.lineup[slotIndex] = {
                number: player.number,
                name: player.name,
                position: position
            };
        }
    }
    
    try {
        dataManager.updateLineup(teamData.lineup);
        loadTeamData(); // Refresh local data
        generateLineupSlots();
        updateStats();
    } catch (error) {
        showNotification('Error updating lineup: ' + error.message, 'error');
    }
}

function changeFormation() {
    const newFormation = document.getElementById('formationSelect').value;
    
    try {
        dataManager.updateFormation(newFormation);
        
        // Reset lineup when changing formation
        teamData.lineup = new Array(11).fill(null);
        dataManager.updateLineup(teamData.lineup);
        
        loadTeamData();
        generateLineupSlots();
        showNotification(`Formation changed to ${newFormation}`, 'success');
        
    } catch (error) {
        showNotification('Error changing formation: ' + error.message, 'error');
    }
}

function saveLineup() {
    try {
        // Filter out null values and ensure we have valid lineup
        const validLineup = teamData.lineup.filter(player => player !== null);
        dataManager.updateLineup(teamData.lineup);
        showNotification('Lineup saved successfully!', 'success');
    } catch (error) {
        showNotification('Error saving lineup: ' + error.message, 'error');
    }
}

function resetLineup() {
    if (confirm('Are you sure you want to reset the lineup?')) {
        try {
            teamData.lineup = new Array(11).fill(null);
            dataManager.updateLineup(teamData.lineup);
            loadTeamData();
            generateLineupSlots();
            updateStats();
            showNotification('Lineup reset successfully!', 'success');
        } catch (error) {
            showNotification('Error resetting lineup: ' + error.message, 'error');
        }
    }
}

// Schedule management functions
function loadScheduleForm() {
    document.getElementById('opponent').value = teamData.nextMatch.opponent;
    document.getElementById('matchDate').value = teamData.nextMatch.date;
    document.getElementById('matchTime').value = teamData.nextMatch.time;
    document.getElementById('venue').value = teamData.nextMatch.venue;
    document.getElementById('isHome').value = teamData.nextMatch.isHome.toString();
}

function updateSchedule() {
    const matchData = {
        opponent: document.getElementById('opponent').value,
        date: document.getElementById('matchDate').value,
        time: document.getElementById('matchTime').value,
        venue: document.getElementById('venue').value,
        isHome: document.getElementById('isHome').value === 'true'
    };
    
    try {
        dataManager.updateNextMatch(matchData);
        loadTeamData();
        updateStats();
        showNotification('Match schedule updated successfully!', 'success');
    } catch (error) {
        showNotification('Error updating schedule: ' + error.message, 'error');
    }
}

// Team status management
function loadTeamStatus() {
    document.getElementById('teamStatus').value = teamData.status.type;
    document.getElementById('statusMessage').value = teamData.status.message;
    updateCurrentStatusDisplay();
}

function updateTeamStatus() {
    const statusType = document.getElementById('teamStatus').value;
    let message = document.getElementById('statusMessage').value;
    
    if (!message) {
        const defaultMessages = {
            training: 'Training Today',
            match: 'Match Day',
            rest: 'Rest Day',
            travel: 'Team Travel'
        };
        message = defaultMessages[statusType];
    }
    
    teamData.status = { type: statusType, message };
    document.getElementById('statusMessage').value = message;
    
    updateCurrentStatusDisplay();
}

function saveTeamStatus() {
    updateTeamStatus();
    
    try {
        dataManager.updateStatus(teamData.status);
        loadTeamData();
        showNotification('Team status updated successfully!', 'success');
    } catch (error) {
        showNotification('Error updating status: ' + error.message, 'error');
    }
}

function updateCurrentStatusDisplay() {
    const statusDot = document.getElementById('currentStatusDot');
    const statusText = document.getElementById('currentStatusText');
    
    statusText.textContent = teamData.status.message;
    
    const statusColors = {
        training: '#2ed573',
        match: '#ff6b6b',
        rest: '#ffa726',
        travel: '#7877c6'
    };
    
    statusDot.style.background = statusColors[teamData.status.type] || '#7877c6';
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#2ed573' : type === 'error' ? '#ff6b6b' : '#17a2b8'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('editPlayerModal');
    if (event.target === modal) {
        closeEditModal();
    }
}

