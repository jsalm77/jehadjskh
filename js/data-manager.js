// Data management system for FC Wolves website
class FCWolvesDataManager {
    constructor() {
        this.storageKey = 'fcWolvesData';
        this.defaultData = this.getDefaultData();
        this.initializeData();
    }

    getDefaultData() {
        return {
            players: [
                { number: 1, name: "Alex Martinez", position: "Goalkeeper", image: "" },
                { number: 2, name: "James Wilson", position: "Right Back", image: "" },
                { number: 3, name: "Carlos Rodriguez", position: "Left Back", image: "" },
                { number: 4, name: "Michael Brown", position: "Center Back", image: "" },
                { number: 5, name: "David Johnson", position: "Center Back", image: "" },
                { number: 6, name: "Thomas Anderson", position: "Defensive Midfielder", image: "" },
                { number: 7, name: "Lucas Silva", position: "Right Midfielder", image: "" },
                { number: 8, name: "Ryan O'Connor", position: "Central Midfielder", image: "" },
                { number: 9, name: "Marco Rossi", position: "Striker", image: "" },
                { number: 10, name: "Ahmed Hassan", position: "Attacking Midfielder", image: "" },
                { number: 11, name: "Gabriel Santos", position: "Left Winger", image: "" },
                { number: 12, name: "Kevin Lee", position: "Goalkeeper", image: "" },
                { number: 13, name: "Pablo Hernandez", position: "Defender", image: "" },
                { number: 14, name: "Yuki Tanaka", position: "Midfielder", image: "" },
                { number: 15, name: "Omar Al-Rashid", position: "Forward", image: "" }
            ],
            lineup: [
                { number: 1, name: "Alex Martinez", position: "GK" },
                { number: 2, name: "James Wilson", position: "RB" },
                { number: 4, name: "Michael Brown", position: "CB" },
                { number: 5, name: "David Johnson", position: "CB" },
                { number: 3, name: "Carlos Rodriguez", position: "LB" },
                { number: 6, name: "Thomas Anderson", position: "CDM" },
                { number: 8, name: "Ryan O'Connor", position: "CM" },
                { number: 10, name: "Ahmed Hassan", position: "CAM" },
                { number: 7, name: "Lucas Silva", position: "RW" },
                { number: 9, name: "Marco Rossi", position: "ST" },
                { number: 11, name: "Gabriel Santos", position: "LW" }
            ],
            nextMatch: {
                opponent: "Eagles FC",
                date: "2025-06-16",
                time: "15:00",
                venue: "Wolves Stadium",
                isHome: true
            },
            status: {
                type: "training",
                message: "Training Today"
            },
            formation: "4-3-3",
            lastUpdated: new Date().toISOString(),
            version: "1.0"
        };
    }

    initializeData() {
        const existingData = this.loadData();
        if (!existingData || !existingData.version) {
            this.saveData(this.defaultData);
        }
    }

    loadData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading data from localStorage:', error);
            return null;
        }
    }

    saveData(data) {
        try {
            data.lastUpdated = new Date().toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            this.notifyDataChange();
            return true;
        } catch (error) {
            console.error('Error saving data to localStorage:', error);
            return false;
        }
    }

    getData() {
        const data = this.loadData();
        return data || this.defaultData;
    }

    updateData(updates) {
        const currentData = this.getData();
        const updatedData = { ...currentData, ...updates };
        return this.saveData(updatedData);
    }

    // Player management methods
    addPlayer(player) {
        const data = this.getData();
        
        // Validate player data
        if (!this.validatePlayer(player)) {
            throw new Error('Invalid player data');
        }
        
        // Check for duplicate jersey number
        if (data.players.some(p => p.number === player.number)) {
            throw new Error('Jersey number already exists');
        }
        
        data.players.push(player);
        data.players.sort((a, b) => a.number - b.number);
        
        return this.saveData(data);
    }

    updatePlayer(index, player) {
        const data = this.getData();
        
        if (index < 0 || index >= data.players.length) {
            throw new Error('Invalid player index');
        }
        
        if (!this.validatePlayer(player)) {
            throw new Error('Invalid player data');
        }
        
        // Check for duplicate jersey number (excluding current player)
        if (data.players.some((p, i) => p.number === player.number && i !== index)) {
            throw new Error('Jersey number already exists');
        }
        
        const oldPlayer = data.players[index];
        data.players[index] = player;
        data.players.sort((a, b) => a.number - b.number);
        
        // Update lineup if player number changed
        if (oldPlayer.number !== player.number) {
            data.lineup = data.lineup.map(lineupPlayer => 
                lineupPlayer && lineupPlayer.number === oldPlayer.number 
                    ? { ...lineupPlayer, number: player.number, name: player.name }
                    : lineupPlayer
            );
        }
        
        return this.saveData(data);
    }

    deletePlayer(index) {
        const data = this.getData();
        
        if (index < 0 || index >= data.players.length) {
            throw new Error('Invalid player index');
        }
        
        const deletedPlayer = data.players[index];
        data.players.splice(index, 1);
        
        // Remove from lineup if present
        data.lineup = data.lineup.map(lineupPlayer => 
            lineupPlayer && lineupPlayer.number === deletedPlayer.number ? null : lineupPlayer
        );
        
        return this.saveData(data);
    }

    validatePlayer(player) {
        return player && 
               typeof player.number === 'number' && 
               player.number > 0 && 
               player.number <= 99 &&
               typeof player.name === 'string' && 
               player.name.trim().length > 0 &&
               typeof player.position === 'string' && 
               player.position.trim().length > 0;
    }

    // Lineup management methods
    updateLineup(lineup) {
        const data = this.getData();
        
        // Validate lineup
        if (!Array.isArray(lineup) || lineup.length > 11) {
            throw new Error('Invalid lineup data');
        }
        
        // Ensure all lineup players exist in the squad
        const validLineup = lineup.map(lineupPlayer => {
            if (!lineupPlayer) return null;
            
            const player = data.players.find(p => p.number === lineupPlayer.number);
            if (!player) return null;
            
            return {
                number: player.number,
                name: player.name,
                position: lineupPlayer.position
            };
        });
        
        data.lineup = validLineup;
        return this.saveData(data);
    }

    updateFormation(formation) {
        const validFormations = ['4-3-3', '4-4-2', '3-5-2', '4-2-3-1'];
        if (!validFormations.includes(formation)) {
            throw new Error('Invalid formation');
        }
        
        return this.updateData({ formation });
    }

    // Match management methods
    updateNextMatch(matchData) {
        if (!this.validateMatchData(matchData)) {
            throw new Error('Invalid match data');
        }
        
        return this.updateData({ nextMatch: matchData });
    }

    validateMatchData(match) {
        return match &&
               typeof match.opponent === 'string' && match.opponent.trim().length > 0 &&
               typeof match.date === 'string' && match.date.match(/^\d{4}-\d{2}-\d{2}$/) &&
               typeof match.time === 'string' && match.time.match(/^\d{2}:\d{2}$/) &&
               typeof match.venue === 'string' && match.venue.trim().length > 0 &&
               typeof match.isHome === 'boolean';
    }

    // Status management methods
    updateStatus(status) {
        const validTypes = ['training', 'match', 'rest', 'travel'];
        
        if (!status || 
            !validTypes.includes(status.type) || 
            typeof status.message !== 'string' || 
            status.message.trim().length === 0) {
            throw new Error('Invalid status data');
        }
        
        return this.updateData({ status });
    }

    // Data synchronization methods
    notifyDataChange() {
        // Dispatch custom event for data changes
        const event = new CustomEvent('fcWolvesDataChanged', {
            detail: { timestamp: new Date().toISOString() }
        });
        window.dispatchEvent(event);
    }

    // Backup and restore methods
    exportData() {
        const data = this.getData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `fc-wolves-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    
                    // Validate imported data structure
                    if (this.validateImportedData(importedData)) {
                        this.saveData(importedData);
                        resolve(importedData);
                    } else {
                        reject(new Error('Invalid data format'));
                    }
                } catch (error) {
                    reject(new Error('Failed to parse JSON file'));
                }
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    validateImportedData(data) {
        return data &&
               Array.isArray(data.players) &&
               Array.isArray(data.lineup) &&
               data.nextMatch &&
               data.status &&
               typeof data.formation === 'string';
    }

    // Reset methods
    resetToDefaults() {
        return this.saveData(this.defaultData);
    }

    clearAllData() {
        try {
            localStorage.removeItem(this.storageKey);
            this.notifyDataChange();
            return true;
        } catch (error) {
            console.error('Error clearing data:', error);
            return false;
        }
    }
}

// Create global instance
window.fcWolvesDataManager = new FCWolvesDataManager();

// Auto-sync data between tabs
window.addEventListener('storage', function(e) {
    if (e.key === 'fcWolvesData') {
        // Reload page data when localStorage changes in another tab
        window.dispatchEvent(new CustomEvent('fcWolvesDataChanged', {
            detail: { source: 'external', timestamp: new Date().toISOString() }
        }));
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FCWolvesDataManager;
}

