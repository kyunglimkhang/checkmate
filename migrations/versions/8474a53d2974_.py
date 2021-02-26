"""empty message

Revision ID: 8474a53d2974
Revises: 1453dc88af58
Create Date: 2021-02-27 00:50:34.710536

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8474a53d2974'
down_revision = '1453dc88af58'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('todo_list_ibfk_1', 'todo_list', type_='foreignkey')
    op.create_foreign_key(None, 'todo_list', 'user', ['user_id'], ['id'], ondelete='CASCADE')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'todo_list', type_='foreignkey')
    op.create_foreign_key('todo_list_ibfk_1', 'todo_list', 'user', ['user_id'], ['id'])
    # ### end Alembic commands ###
