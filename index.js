const fs = require("fs");
const xlsx = require('node-xlsx').default;


function getTable(file_name) {
    return xlsx.parse(`${__dirname}/${file_name}`, {cellDates: true});
}

function getDataFromTable(file, requiredColumn = null) {
    let data = []
    for (let row = 1; row < file[0]['data'].length; row++) {
        if (requiredColumn !== null) {
            let elementIndex = file[0]['data'][0].indexOf(requiredColumn)
            data.push(file[0]['data'][row][elementIndex])
        } else {
            data.push(file[0]['data'][row])
        }
    }
    return data
}

function parseClients(client_list) {
    let clients = []
    for (let client of client_list) {
        if (client.length > 0) {
            let startDate = `${String(client[4].getDate()).padStart(2, '0')}/${String(client[4].getMonth()).padStart(2, '0')}/${client[4].getFullYear()}`
            let endDate = `${String(client[5].getDate()).padStart(2, '0')}/${String(client[5].getMonth()).padStart(2, '0')}/${client[5].getFullYear()}`
            clients.push({
                firstName: client[0],
                lastName: client[1],
                email: client[2],
                phone: client[3].replace(/\D/g, ''),
                startDate: startDate,
                endDate: endDate,
                membershipName: client[6],
            })
        }
    }
    return clients
}

function buildQueries(customersList, lastUsedId, clubId) {
    let queries = {
        usersQueryString: 'INSERT INTO users (first_name, last_name, phone, email, joined_at, club_id) VALUES ',
        membershipQueryString: 'INSERT INTO users (user_id, start_date, end_date, membership_name) VALUES '
    }
    for (let i = 0; i < customersList.length; i++) {
        lastUsedId++
        queries.usersQueryString += `("${customersList[i]['firstName']}", "${customersList[i]['lastName']}", ${customersList[i]['phone']}, "${customersList[i]['email']}", "${customersList[i]['startDate']}", ${clubId})`
        queries.membershipQueryString += `(${lastUsedId}, "${customersList[i]['startDate']}", "${customersList[i]['endDate']}", "${customersList[i]['membershipName']}")`
        if (i < customersList.length - 1) {
            queries.usersQueryString += ', '
            queries.membershipQueryString += ', '
        } else {
            queries.usersQueryString += ';'
            queries.membershipQueryString += ';'
        }
    }
    return queries
}

function main(fileName, clubId) {
    let existingClientsFile = getTable('ar_db.xlsx')
    let existingClients = getDataFromTable(existingClientsFile, 'email')
    let lastUsedId = existingClientsFile[0]['data'][existingClientsFile[0]['data'].length - 1][0]

    let newClientsFile = getTable(fileName)
    let newClientsList = getDataFromTable(newClientsFile)
    let parsedClientList = parseClients(newClientsList)
    let filteredClients = parsedClientList.filter(client => !existingClients.includes(client['email']))

    let doneQueries = buildQueries(filteredClients, lastUsedId, clubId)
    fs.writeFile(`${__dirname}/update_db.sql`, `${doneQueries.usersQueryString}\n${doneQueries.membershipQueryString}`, function (err) {
        if (err) throw err;
        console.log('File has been created successfully.');
    })
}

const args = process.argv.slice(2);
if (args.length < 2) {
    throw 'Too many/Not enough parameters provided'
}
main(args[0], args[1])
