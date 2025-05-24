// Food db with nutrition
        const foodDatabase = {
            'main-course': [
                { name: 'Butter Chicken', emoji: '🍗', calories: 350, protein: 25, carbs: 15, fiber: 2 },
                { name: 'Paneer Makhani', emoji: '🧀', calories: 320, protein: 18, carbs: 12, fiber: 3 },
                { name: 'Dal Tadka', emoji: '🟡', calories: 180, protein: 12, carbs: 28, fiber: 8 },
                { name: 'Rajma', emoji: '🔴', calories: 220, protein: 15, carbs: 35, fiber: 10 },
                { name: 'Chole', emoji: '🟤', calories: 200, protein: 12, carbs: 30, fiber: 9 }
            ],
            'rice-bread': [
                { name: 'Basmati Rice', emoji: '🍚', calories: 200, protein: 4, carbs: 45, fiber: 1 },
                { name: 'Jeera Rice', emoji: '🌾', calories: 220, protein: 4, carbs: 48, fiber: 2 },
                { name: 'Roti', emoji: '🫓', calories: 80, protein: 3, carbs: 15, fiber: 2 },
                { name: 'Naan', emoji: '🥖', calories: 150, protein: 5, carbs: 25, fiber: 1 },
                { name: 'Paratha', emoji: '🥞', calories: 180, protein: 6, carbs: 22, fiber: 3 }
            ],
            'vegetables': [
                { name: 'Aloo Gobi', emoji: '🥔', calories: 120, protein: 3, carbs: 20, fiber: 4 },
                { name: 'Palak Paneer', emoji: '🥬', calories: 180, protein: 12, carbs: 8, fiber: 5 },
                { name: 'Bhindi Masala', emoji: '🌶️', calories: 90, protein: 3, carbs: 12, fiber: 6 },
                { name: 'Baingan Bharta', emoji: '🍆', calories: 110, protein: 2, carbs: 15, fiber: 7 },
                { name: 'Mixed Vegetable', emoji: '🥗', calories: 100, protein: 4, carbs: 18, fiber: 5 }
            ],
            'desserts': [
                { name: 'Gulab Jamun', emoji: '🍮', calories: 150, protein: 3, carbs: 25, fiber: 1 },
                { name: 'Rasgulla', emoji: '⚪', calories: 120, protein: 4, carbs: 22, fiber: 0 },
                { name: 'Kulfi', emoji: '🍦', calories: 180, protein: 6, carbs: 20, fiber: 0 },
                { name: 'Kheer', emoji: '🥛', calories: 160, protein: 5, carbs: 28, fiber: 1 },
                { name: 'Jalebi', emoji: '🟠', calories: 200, protein: 2, carbs: 35, fiber: 0 }
            ]
        };

        let currentThali = {};
        let diaryEntries = JSON.parse(window.localStorage?.getItem('thaliDiary') || '[]') || [];

        // to Initialize the app
        function init() {
            renderFoodItems();
            updateNutritionDisplay();
            renderDiary();
            setupDragAndDrop();
        }

        //too Render food items
        function renderFoodItems() {
            Object.keys(foodDatabase).forEach(category => {
                const box = document.getElementById(category);
                box.innerHTML = '';
                
                foodDatabase[category].forEach(food => {
                    const foodElement = document.createElement('div');
                    foodElement.className = 'food-item';
                    foodElement.draggable = true;
                    foodElement.dataset.food = JSON.stringify(food);
                    
                    foodElement.innerHTML = `
                        <div class="food-emoji">${food.emoji}</div>
                        <div class="food-name">${food.name}</div>
                    `;
                    
                    box.appendChild(foodElement);
                });
            });
        }

        //  drag and drop
        function setupDragAndDrop() {
            let draggedFood = null;

            // Food  drag 
            document.querySelectorAll('.food-item').forEach(item => {
                item.addEventListener('dragstart', (e) => {
                    draggedFood = JSON.parse(e.target.dataset.food);
                    e.target.classList.add('dragging');
                });

                item.addEventListener('dragend', (e) => {
                    e.target.classList.remove('dragging');
                });
            });

            // Thali section drop 
            document.querySelectorAll('.thali-section').forEach(section => {
                section.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    section.style.background = 'rgba(255,255,255,0.5)';
                });

                section.addEventListener('dragleave', (e) => {
                    section.style.background = 'rgba(255,255,255,0.1)';
                });

                section.addEventListener('drop', (e) => {
                    e.preventDefault();
                    section.style.background = 'rgba(255,255,255,0.1)';
                    
                    if (draggedFood) {
                        const sectionName = section.dataset.section;
                        currentThali[sectionName] = draggedFood;
                        
                        
                        section.innerHTML = `<div class="placed-food">${draggedFood.emoji}</div>`;
                        section.classList.add('filled');
                        
                       
                        addSteamEffect(section);
                        
                        updateNutritionDisplay();
                        draggedFood = null;
                    }
                });
            });
        }

        //  steam animation 
        function addSteamEffect(section) {
            const steam = document.createElement('div');
            steam.innerHTML = '💨';
            steam.style.position = 'absolute';
            steam.style.top = '-20px';
            steam.style.left = '50%';
            steam.style.transform = 'translateX(-50%)';
            steam.style.fontSize = '1.5rem';
            steam.style.animation = 'steamRise 2s ease-out forwards';
            steam.style.pointerEvents = 'none';
            
            section.appendChild(steam);
            
            //  CSS for steam animation
            if (!document.querySelector('#steam-animation')) {
                const style = document.createElement('style');
                style.id = 'steam-animation';
                style.textContent = `
                    @keyframes steamRise {
                        0% { opacity: 1; transform: translateX(-50%) translateY(0px) scale(1); }
                        100% { opacity: 0; transform: translateX(-50%) translateY(-40px) scale(1.5); }
                    }
                `;
                document.head.appendChild(style);
            }
            
            setTimeout(() => {
                if (steam.parentNode) {
                    steam.parentNode.removeChild(steam);
                }
            }, 2000);
        }

        // Update nutrition display
        function updateNutritionDisplay() {
            const totalNutrition = {
                calories: 0,
                protein: 0,
                carbs: 0,
                fiber: 0
            };

            Object.values(currentThali).forEach(food => {
                totalNutrition.calories += food.calories;
                totalNutrition.protein += food.protein;
                totalNutrition.carbs += food.carbs;
                totalNutrition.fiber += food.fiber;
            });

            // Update display
            document.getElementById('calories').textContent = totalNutrition.calories;
            document.getElementById('protein').textContent = totalNutrition.protein + 'g';
            document.getElementById('carbs').textContent = totalNutrition.carbs + 'g';
            document.getElementById('fiber').textContent = totalNutrition.fiber + 'g';

            // Update progress bars
            updateProgressBar('calories-bar', totalNutrition.calories, 2000);
            updateProgressBar('protein-bar', totalNutrition.protein, 50);
            updateProgressBar('carbs-bar', totalNutrition.carbs, 250);
            updateProgressBar('fiber-bar', totalNutrition.fiber, 25);

            // Update balance indicator
            updateBalanceIndicator(totalNutrition);
        }

        // Update progress
        function updateProgressBar(barId, value, maxValue) {
            const bar = document.getElementById(barId);
            const percentage = Math.min((value / maxValue) * 100, 100);
            bar.style.width = percentage + '%';
        }

        // Update balance indi.
        function updateBalanceIndicator(nutrition) {
            const indicator = document.getElementById('balance-indicator');
            const thaliItems = Object.keys(currentThali).length;
            
            if (thaliItems === 0) {
                indicator.textContent = '🎯 Add items to see balance';
                indicator.className = 'balance-indicator';
                return;
            }

            let balanceScore = 0;
            let message = '';

            // Check for  nutrition
            if (nutrition.protein >= 20) balanceScore += 2;
            else if (nutrition.protein >= 10) balanceScore += 1;

            if (nutrition.fiber >= 10) balanceScore += 2;
            else if (nutrition.fiber >= 5) balanceScore += 1;

            if (nutrition.calories >= 400 && nutrition.calories <= 800) balanceScore += 2;
            else if (nutrition.calories <= 1000) balanceScore += 1;

            if (thaliItems >= 4) balanceScore += 1;

            if (balanceScore >= 6) {
                indicator.textContent = '🎉 Perfectly Balanced Thali!';
                indicator.className = 'balance-indicator balance-good';
            } else if (balanceScore >= 4) {
                indicator.textContent = '⚠️ Good Balance - Add more protein or fiber';
                indicator.className = 'balance-indicator balance-warning';
            } else {
                indicator.textContent = '❌ Needs More Balance - Add variety';
                indicator.className = 'balance-indicator balance-poor';
            }
        }

        // Save to diary
        function saveThali() {
            if (Object.keys(currentThali).length === 0) {
                alert('Please add some items to your thali first! 🍽️');
                return;
            }

            const totalNutrition = {
                calories: 0,
                protein: 0,
                carbs: 0,
                fiber: 0
            };

            Object.values(currentThali).forEach(food => {
                totalNutrition.calories += food.calories;
                totalNutrition.protein += food.protein;
                totalNutrition.carbs += food.carbs;
                totalNutrition.fiber += food.fiber;
            });

            const entry = {
                id: Date.now(),
                date: new Date().toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                thali: { ...currentThali },
                nutrition: totalNutrition,
                timestamp: Date.now()
            };

            diaryEntries.unshift(entry);
            
            // Save to localStorage 
            try {
                if (window.localStorage) {
                    window.localStorage.setItem('thaliDiary', JSON.stringify(diaryEntries));
                }
            } catch (e) {
                console.log('Storage not available, entries will be lost on refresh');
            }

            showModal();
            renderDiary();
        }

        // Clear current thali
        function clearThali() {
            currentThali = {};
            document.querySelectorAll('.thali-section').forEach(section => {
                section.innerHTML = '';
                section.classList.remove('filled');
            });
            updateNutritionDisplay();
            
            // Add clear animation
            document.querySelectorAll('.thali-section').forEach((section, index) => {
                setTimeout(() => {
                    section.style.animation = 'pulse 0.3s ease';
                    setTimeout(() => {
                        section.style.animation = '';
                    }, 300);
                }, index * 100);
            });
        }

        // Show success
        function showModal() {
            const modal = document.getElementById('success-modal');
            modal.style.display = 'block';
            setTimeout(() => {
                closeModal();
            }, 3000);
        }

        function closeModal() {
            const modal = document.getElementById('success-modal');
            modal.style.display = 'none';
        }
        function showSection(section) {
            document.querySelectorAll('.main-content').forEach(content => {
                content.classList.remove('active');
            });
            document.querySelectorAll('.nav-button').forEach(button => {
                button.classList.remove('active');
            });

            document.getElementById(section).classList.add('active');
            event.target.classList.add('active');

            if (section === 'diary') {
                renderDiary();
            }
        }

        //  diary entries
        function renderDiary() {
            const box = document.getElementById('diary-entries');
            const totalThalis = document.getElementById('total-thalis');
            const avgCalories = document.getElementById('avg-calories');
            const balancedMeals = document.getElementById('balanced-meals');

            // Update stats
            totalThalis.textContent = diaryEntries.length;
            
            if (diaryEntries.length > 0) {
                const totalCals = diaryEntries.reduce((sum, entry) => sum + entry.nutrition.calories, 0);
                avgCalories.textContent = Math.round(totalCals / diaryEntries.length);
                
                const balanced = diaryEntries.filter(entry => 
                    entry.nutrition.protein >= 15 && 
                    entry.nutrition.fiber >= 8 && 
                    Object.keys(entry.thali).length >= 4
                ).length;
                balancedMeals.textContent = balanced;
            } else {
                avgCalories.textContent = '0';
                balancedMeals.textContent = '0';
            }

            // Render entries
            if (diaryEntries.length === 0) {
                box.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 60px; color: #666;">
                        <div style="font-size: 4rem; margin-bottom: 20px;">🍽️</div>
                        <h3>No thalis saved yet!</h3>
                        <p>Start building your first thali to begin your delicious journey.</p>
                    </div>
                `;
                return;
            }

            box.innerHTML = diaryEntries.map(entry => `
                <div class="diary-card">
                    <div class="diary-date">${entry.date}</div>
                    <div class="diary-thali">
                        ${Object.values(entry.thali).map(food => 
                            `<span class="diary-food" title="${food.name}">${food.emoji}</span>`
                        ).join('')}
                    </div>
                    <div class="diary-nutrition">
                        🔥 ${entry.nutrition.calories} cal | 
                        💪 ${entry.nutrition.protein}g protein | 
                        🌾 ${entry.nutrition.fiber}g fiber
                    </div>
                    <button class="delete-button" onclick="deleteEntry(${entry.id})">
                        🗑️ Delete
                    </button>
                </div>
            `).join('');
        }

        // Delete diary entry
        function deleteEntry(entryId) {
            if (confirm('Are you sure you want to delete this thali entry? 🗑️')) {
                diaryEntries = diaryEntries.filter(entry => entry.id !== entryId);
                
                try {
                    if (window.localStorage) {
                        window.localStorage.setItem('thaliDiary', JSON.stringify(diaryEntries));
                    }
                } catch (e) {
                    console.log('Storage not available');
                }
                
                renderDiary();
                
                // Show delete animation
                const deletedCard = event.target.closest('.diary-card');
                deletedCard.style.animation = 'fadeOut 0.5s ease forwards';
            }
        }

        // Add fade out animation
        const fadeOutStyle = document.createElement('style');
        fadeOutStyle.textContent = `
            @keyframes fadeOut {
                to { opacity: 0; transform: translateX(-100%) scale(0.5); }
            }
        `;
        document.head.appendChild(fadeOutStyle);

        //  floating elements 
        function initFloatingElements() {
            const elements = document.querySelectorAll('.floating-element');
            elements.forEach((element, index) => {
                element.style.animationDelay = `${index * 1.2}s`;
                element.style.animationDuration = `${4 + Math.random() * 4}s`;
            });
        }

        // 
        function message() {
            const messages = [
                "🌟 Great choice! Your thali looks delicious!",
                "🎯 Perfect balance of flavors and nutrition!",
                "🚀 You're on a roll with healthy eating!",
                "💫 Every thali tells a story - yours is amazing!",
                "🏆 Thali master in the making!"
            ];
            return messages[Math.floor(Math.random() * messages.length)];
        }

        // keys shrtcut
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                saveThali();
            }
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                clearThali();
            }
        });

        document.getElementById('success-modal').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                closeModal();
            }
        });

        // Initialize the app
        document.addEventListener('DOMContentLoaded', () => {
            init();
            initFloatingElements();
            
            // welcome message 
            setTimeout(() => {
                console.log('🍽️ Welcome to The Thali Diaries! Start building your perfect thali!');
            }, 1000);
        });

       
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('food-emoji')) {
                e.target.style.animation = 'bounce 0.5s ease';
                setTimeout(() => {
                    e.target.style.animation = '';
                }, 500);
            }
        });

        //  bounce animation
        const bounceStyle = document.createElement('style');
        bounceStyle.textContent = `
            @keyframes bounce {
                0%, 20%, 60%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                80% { transform: translateY(-5px); }
            }
        `;
        document.head.appendChild(bounceStyle);

        // loading animation
        function animateNutritionBars() {
            const bars = document.querySelectorAll('.nutrition-fill');
            bars.forEach((bar, index) => {
                setTimeout(() => {
                    bar.style.transition = 'width 0.8s ease';
                }, index * 200);
            });
        }

        setTimeout(animateNutritionBars, 500);