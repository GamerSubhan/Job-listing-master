const jobPost = document.querySelectorAll('.jobPost');
const searchInput = document.querySelector('input');

function UpdateContent(data)
{
    jobPost.forEach((job) => {
        
        if(Number(job.id) === data.id)
        {
            job.querySelector('img').src = data.logo;
            job.querySelector('p').textContent = data.company;
            job.querySelector('h4').textContent = data.position;
            job.querySelector('#date').textContent = data.postedAt;
            job.querySelector('#contract').textContent = data.contract;
            job.querySelector('#location').textContent = data.location;

            const newMsg = document.createElement('div');
            const newText = document.createElement('p');
            newText.textContent = 'NEW!';
            newText.id = 'newText';
            newMsg.appendChild(newText);

            const featuredMsg = document.createElement('div');
            const featuredText = document.createElement('p');
            featuredText.textContent = 'FEATURED';
            featuredText.id = 'featuredText';
            featuredMsg.appendChild(featuredText);

            newMsg.id = 'new';
            featuredMsg.id = 'featured';

            if(data.new === true)
            {
                job.appendChild(newMsg);
            }

            if(data.featured === true)
            {
                job.appendChild(featuredMsg);
                job.style.borderLeft = '4px solid hsl(180, 29%, 50%)';
            }

            const skillsList = job.querySelector('#skills');

            job.querySelector('#role').textContent = data.role;
            job.querySelector('#level').textContent = data.level;

            data.languages.forEach(language => {
                const li = document.createElement('li');        
                li.textContent = language;       
                skillsList.appendChild(li);
            });
            data.tools.forEach(tool => {
                const li = document.createElement('li');        
                li.textContent = tool;       
                skillsList.appendChild(li);
            });
        }
    })
}

fetch('data.json')
.then(res => res.json())
.then(data => {
    data.forEach(element => {
        UpdateContent(element);
    });
});

let inputValuePadding = 5;
let filterCount = 0;
const keyList = document.getElementById('keyList');
let cleared = false;

searchInput.addEventListener('keydown', event => {
    if(event.key === 'Enter' && searchInput.value.trim() !== '' && filterCount < 5)
    {
        filterCount++;

        const removeButton = document.createElement('button');
        const removeIcon = document.createElement('img');
        removeButton.appendChild(removeIcon);
        removeIcon.src = 'images/icon-remove.svg';
        removeIcon.id = 'remove';
        removeButton.id = 'removeBtn';

        const keyValue = document.createElement('li');
        keyValue.textContent = searchInput.value;
        keyValue.className = 'filter';
        keyList.appendChild(keyValue);
        keyValue.appendChild(removeButton);

        if(cleared)
        {
            inputValuePadding = 5;
            cleared = false;
        }

        if(searchInput.value.length > 8)
        {
            inputValuePadding += 16;
        }
        else
        {
            inputValuePadding += 14;
        }

        searchInput.value = '';
        searchInput.style.textIndent = `${inputValuePadding}%`;

        RemoveFilter();

        findJob(keyValue);
    }
})

let filterRemoved = false;

function RemoveFilter()
{
    const filters = document.querySelectorAll('.filter');

    filters.forEach(filter => {
        const removeButton = filter.querySelector('#removeBtn');
        removeButton.addEventListener('click', () => {
            filter.remove();
            filterCount--;
            if(inputValuePadding > 5)
            {
                inputValuePadding -= 14;
            }
            searchInput.style.textIndent = `${inputValuePadding}%`;
            filterRemoved = true;
        });
    });
}

function findJob(filter)
{
    const attribution = document.querySelector('.attribution');
    jobPost.forEach(job => {
        let removedElement = null;

        const skillsList = job.querySelector('#skills');
        const skillFilters = skillsList.querySelectorAll('li');

        let isMatching = HasMatchingSkills(skillFilters, filter);
        let removedAttribution = attribution;  

        if(!isMatching)
        {
            removedElement = job;
            job.remove();
        }

        clearBtn.addEventListener('click', () => {
            ResetFilters(removedElement, job, removedAttribution, attribution);
        });

        const removeButton = filter.querySelector('#removeBtn');
        console.log(keyList.querySelectorAll('li').length);   

        removeButton.addEventListener('click', () => {
            const updatedFilters = keyList.querySelectorAll('li');     
            if(updatedFilters.length <= 0)
            {
                ResetFilters(removedElement, job, removedAttribution, attribution);
                console.log("Updated filter is not exist!");
            }
            updatedFilters.forEach(updatedFilter => { 
                let isMatching = HasMatchingSkills(skillFilters, updatedFilter);
                if(isMatching)
                {
                    document.querySelector('body').appendChild(removedElement);
                }
                removedAttribution = attribution;
                attribution.remove();
            })
        });
    });
}

function ResetFilters(removedElement, job, removedAttribution, attribution)
{
    removedElement = job;
    job.remove();
    removedAttribution = attribution;
    attribution.remove();
    if(removedElement)
    {
        document.querySelector('body').appendChild(removedElement);
        document.querySelector('body').appendChild(removedAttribution);
    }
}

function HasMatchingSkills(skillFilters, filter)
{
    for (let skillFilter of skillFilters) {
        if (skillFilter.textContent.trim().toUpperCase() === filter.textContent.trim().toUpperCase()) {
            return true;
        }
    }
    return false;
}

const clearBtn = document.getElementById('clearButton');

clearBtn.addEventListener('click', () => {
    const filters = document.querySelectorAll('.filter');
    console.log('Removed all of them!');
    filters.forEach(filter => {
        filter.remove();
        cleared = true;
        searchInput.style.textIndent = '';
        filterCount = 0;
    });
});

