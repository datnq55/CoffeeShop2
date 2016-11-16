#ifndef __TABLE_H__
#define __TABLE_H__

#include <QString>

class Table
{
public:
    enum TableState
    {
        TABLE_STATE_EMPTY,
        TABLE_STATE_WAITING,
        TABLE_STATE_UNPAID,
    };

    Table();
    ~Table();

    void SetId(QString strId);
    QString GetId();
    void SetName(QString strName);
    QString GetName();
    void SetFloor(int nFloor);
    int GetFloor();
    void SetState(int nState);
    int GetState();
protected:
    QString m_strId;
    QString m_strName;
    int m_nFloor;
    int m_nState;
};

#endif // __TABLE_H__
