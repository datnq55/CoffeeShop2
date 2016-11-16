#include "table.h"

Table::Table()
{
    m_strId = "";
    m_strName = "";
    m_nFloor = -1;
    m_nState = TABLE_STATE_EMPTY;
}

Table::~Table()
{

}

void Table::SetId(QString strId)
{
    m_strId = strId;
}

QString Table::GetId()
{
    return m_strId;
}

void Table::SetName(QString strName)
{
    m_strName = strName;
}

QString Table::GetName()
{
    return m_strName;
}

void Table::SetFloor(int nFloor)
{
    m_nFloor = nFloor;
}

int Table::GetFloor()
{
    return m_nFloor;
}

void Table::SetState(int nState)
{
    m_nState = nState;
}

int Table::GetState()
{
    return m_nState;
}
